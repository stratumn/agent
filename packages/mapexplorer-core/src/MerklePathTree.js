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

import { tree, stratify } from 'd3-hierarchy';
import { select } from 'd3-selection';

import { makeLink, translate } from './treeUtils';
import compactHash from './compactHash';

const margin = { top: 10, right: 5, bottom: 20, left: 5 };
const height = 350 - margin.top - margin.bottom;
const width = 400 - margin.left - margin.right;

function parse(merklePath) {
  const nodes = [];

  merklePath.forEach((path, index) => {
    nodes.push({
      id: `${path.left}-${index}`,
      name: path.left,
      parentId: `${path.parent}-${index + 1}`
    });
    if (path.right) {
      nodes.push({
        id: `${path.right}-${index}`,
        name: path.right,
        parentId: `${path.parent}-${index + 1}`
      });
    }
  });

  const root = merklePath[merklePath.length - 1].parent;
  nodes.push({
    id: `${root}-${merklePath.length}`,
    name: root
  });

  return stratify()(nodes);
}

export default class MerklePathTree {
  constructor(element) {
    this.tree = tree().size([width, height]);
    this.svg = select(element)
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);
    this.innerG = this.svg
      .append('g')
      .attr('transform', () => translate(margin.top, margin.left));
    this.root = null;
  }

  display(merklePath) {
    if (merklePath && merklePath.length) {
      this.root = parse(merklePath);
      this.update(this.root.descendants(), this.root.links());
    } else {
      this.root = null;
      this.update([], []);
    }
  }

  update(nodes, links) {
    // Compute the new tree layout.
    if (this.root) {
      this.tree(this.root);
    }

    // Update the nodes…
    const node = this.innerG.selectAll('g.node').data(nodes, function key(d) {
      return d ? d.id : this.id;
    });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => translate(d.y, d.x));

    nodeEnter.append('circle').attr('r', 10);

    nodeEnter
      .append('text')
      .attr('dx', 0)
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .text(d => compactHash(d.data.name));

    nodeEnter
      .on('mouseover', function go(d) {
        select(this)
          .select('text')
          .text(d.data.name);
      })
      .on('mouseout', function go(d) {
        select(this)
          .select('text')
          .text(compactHash(d.data.name));
      });

    node.exit().remove();

    // Update the links...
    const link = this.innerG
      .selectAll('path.link')
      .data(links, function key(d) {
        return d ? d.target.id : this.id;
      });

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('id', d => d.target.id)
      .attr('d', d =>
        makeLink(
          { x: d.source.y, y: d.source.x },
          { x: d.target.y, y: d.target.x }
        )
      );

    // Transition exiting nodes to the parent's new position.
    link.exit().remove();
  }
}
