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
import { getAgent } from 'stratumn-agent-client';

function findNodeRefs(node) {
  let refs = [];
  if (node.children) {
    for (let i = 0; i < node.children.length; i += 1) {
      refs = refs.concat(findNodeRefs(node.children[i]));
    }
  }
  if (node.data.link.meta.refs) {
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
  const nodes = root.descendants();
  const refs = findNodeRefs(root);
  for (let i = 0; i < refs.length; i += 1) {
    const source = nodes.find(e => e.id === refs[i].source.linkHash);
    const target = nodes.find(e => e.id === refs[i].target.id);
    if (source && target) {
      extraLinks.push({ source, target, ref: true });
    } else if (!source) {
      let newSourceNode = extraLinks
        .map(l => l.source)
        .find(n => n.data.meta.linkHash === refs[i].source.linkHash);
      if (!newSourceNode) {
        newSourceNode = hierarchy(
          {
            link: {
              meta: {
                mapId: refs[i].source.mapId,
                process: refs[i].source.process
              }
            },
            meta: { linkHash: refs[i].source.linkHash }
          },
          () => null
        );
      }
      extraLinks.push({
        source: Object.assign(newSourceNode, { id: refs[i].source.linkHash }),
        target,
        ref: true
      });
    }
  }

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
      .then(agent => {
        const process = agent.processes[ref.data.link.meta.process];
        if (!process) {
          throw new Error('process', ref.data.link.meta.process, 'not found');
        }
        return process;
      })
      .then(process =>
        process.findSegments({
          mapIds: [ref.data.link.meta.mapId],
          limit: -1
        })
      )
      .then(segments => {
        if (!segments || segments.length === 0) {
          throw new Error(
            `no segments for map ${ref.data.link.meta.process} not found`
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
            child.link.meta.prevLinkHash = ref.data.meta.linkHash;
            child.link.meta.refs = null;
            child.link.meta.action = 'reference';
            child.link.meta.arguments = null;
            child.isRef = true;
            return child;
          });
        const fullSegments = segments.concat(foreignChildren);
        return fullSegments;
      })
      .catch(res => console.log(res));
  }
  throw new Error('unknown agent url');
}

export { findExtraLinks, findExtraNodes, loadRef };
