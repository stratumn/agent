/*
  Copyright 2018 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { hierarchy } from 'd3-hierarchy';
import { getAgent } from '@indigocore/client';

function findNodeRefs(node) {
  let refs = [];
  if (node && node.children) {
    node.children.forEach(child => {
      refs = refs.concat(findNodeRefs(child));
    });
  }
  if (node && node.data.link.meta.refs) {
    return refs.concat(
      node.data.link.meta.refs.map(r => ({
        source: r,
        target: node
      }))
    );
  }
  return refs;
}

function fetchForeignLink(agent, ref) {
  if (!agent) {
    return Promise.resolve(
      hierarchy(
        {
          link: { meta: { process: ref.source.process } },
          meta: { linkHash: ref.source.linkHash }
        },
        () => null
      )
    );
  }

  if (!ref.source.process || !ref.source.linkHash) {
    throw new Error(
      `findExtraLinks: wrong reference format for linkHash '${ref.source
        .linkHash}' (should have process, linkHash)`
    );
  }
  return agent
    .getProcess(ref.source.process)
    .getSegment(ref.source.linkHash)
    .then(reference => hierarchy(reference, () => null));
}

function findExtraLinks(root, agent) {
  const extraLinks = [];
  const nodes = root ? root.descendants() : [];
  const refs = findNodeRefs(root);
  refs
    .reduce((acc, val) => {
      if (
        !acc.find(
          l =>
            l.source.linkHash === val.source.linkHash &&
            l.target.id === val.target.id
        )
      ) {
        acc.push(val);
      }
      return acc;
    }, [])
    .forEach(ref => {
      const source = nodes.find(e => e.id === ref.source.linkHash);
      const target = nodes.find(e => e.id === ref.target.id);

      if (source && target) {
        extraLinks.push({ source, target, ref: true });
      } else if (!source && target) {
        const fetchedRef = extraLinks
          .map(l => l.source)
          .filter(Boolean)
          .find(n => n.data.meta.linkHash === ref.source.linkHash);
        let newSourceNode = Promise.resolve(fetchedRef);
        if (!fetchedRef) {
          newSourceNode = fetchForeignLink(agent, ref);
        }
        extraLinks.push(
          newSourceNode.then(sourceNode => ({
            source: Object.assign(sourceNode, { id: ref.source.linkHash }),
            target,
            ref: true
          }))
        );
      }
    });
  return Promise.all(extraLinks);
}

function findExtraNodes(links, nodes) {
  const extraNodes = [];
  links.filter(l => l.ref === true).map(l => {
    if (
      !nodes.find(n => n.id === l.source.id) &&
      !extraNodes.find(n => n.id === l.source.id)
    ) {
      extraNodes.push(l.source);
    }
    return l;
  });
  return extraNodes;
}

function loadRef(agentUrl, ref, links) {
  if (agentUrl && ref.data.link.meta.mapId) {
    return getAgent(agentUrl)
      .then(agent => agent.getProcess(ref.data.link.meta.process))
      .then(process =>
        process.findSegments({
          mapIds: [ref.data.link.meta.mapId],
          limit: -1
        })
      )
      .then(({ segments }) => {
        if (!segments || segments.length === 0) {
          throw new Error(
            `loadRef: no segments for map ${ref.data.link.meta.mapId}`
          );
        }
        const foreignChildren = links
          .filter(
            l =>
              l.ref === true &&
              l.source.data.meta.linkHash === ref.data.meta.linkHash
          )
          .map(l => {
            const child = l.target.data;
            child.link.meta.refs = null;
            child.parentRef = ref.data.meta.linkHash;
            return child;
          });
        return segments.concat(foreignChildren);
      });
  }
  throw new Error('loadRef: unknown agent url or reference mapID');
}

export { findExtraLinks, findExtraNodes, loadRef };
