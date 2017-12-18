/*
  Copyright 2017 Stratumn SAS. All rights reserved.

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
import { getAgent } from '@indigoframework/client';

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

function findExtraLinks(root) {
  const extraLinks = [];
  const nodes = root ? root.descendants() : [];
  const refs = findNodeRefs(root);
  refs.forEach(ref => {
    const source = nodes.find(e => e.id === ref.source.linkHash);
    const target = nodes.find(e => e.id === ref.target.id);
    if (
      !extraLinks.find(
        l => l.source.id === ref.source.linkHash && l.target.id === target.id
      )
    ) {
      if (source && target) {
        extraLinks.push({ source, target, ref: true });
      } else if (!source && target) {
        let newSourceNode = extraLinks
          .map(l => l.source)
          .find(n => n.data.meta.linkHash === ref.source.linkHash);
        if (!newSourceNode) {
          if (
            !ref.source.mapId ||
            !ref.source.process ||
            !ref.source.linkHash
          ) {
            throw new Error(
              `findExtraLinks: wrong reference format for linkHash '${ref.source
                .linkHash}' (should have process, mapId, linkHash)`
            );
          }
          newSourceNode = hierarchy(
            {
              link: {
                meta: {
                  mapId: ref.source.mapId,
                  process: ref.source.process
                }
              },
              meta: { linkHash: ref.source.linkHash }
            },
            () => null
          );
        }
        extraLinks.push({
          source: Object.assign(newSourceNode, { id: ref.source.linkHash }),
          target,
          ref: true
        });
      }
    }
  });

  return extraLinks;
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
  if (agentUrl) {
    return getAgent(agentUrl)
      .then(agent => agent.getProcess(ref.data.link.meta.process))
      .then(process =>
        process.findSegments({
          mapIds: [ref.data.link.meta.mapId],
          limit: -1
        })
      )
      .then(segments => {
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
  throw new Error('loadRef: unknown agent url');
}

export { findExtraLinks, findExtraNodes, loadRef };
