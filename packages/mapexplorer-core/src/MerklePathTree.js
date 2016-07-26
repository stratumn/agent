import { makeLink, translate } from './treeUtils';
import compactHash from './compactHash';
import d3 from 'd3';

const margin = { top: 10, right: 5, bottom: 20, left: 5 };
const height = 350 - margin.top - margin.bottom;
const width = 400 - margin.left - margin.right;

export default class MerklePathTree {
  constructor(element) {
    this.tree = d3.tree().size([width, height]);
    this.svg = d3.select(element.find('svg')[0])
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);
    this.innerG = this.svg.append('g')
      .attr('transform', () => translate(margin.top, margin.left));
    this.root = null;
  }

  display(merklePath) {
    if (merklePath && merklePath.length) {
      this.root = this._parse(merklePath);
      this._update(this.root.descendants(), this.root.links());
    } else {
      this.root = null;
      this._update([], []);
    }
  }

  _parse(merklePath) {
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

    return d3.stratify()(nodes);
  }

  _update(nodes, links) {
    // Compute the new tree layout.
    if (this.root) {
      this.tree(this.root);
    }

    // Update the nodes…
    const node = this.innerG.selectAll('g.node').data(nodes,
      function key(d) { return d ? d.id : this.id; });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => translate(d.y, d.x));

    nodeEnter.append('circle').attr('r', 10);

    nodeEnter.append('text')
      .attr('dx', 0)
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .text(d => compactHash(d.data.name));

    nodeEnter
      .on('mouseover', function go(d) {
        d3.select(this).select('text').text(d.data.name);
      })
      .on('mouseout', function go(d) {
        d3.select(this).select('text').text(compactHash(d.data.name));
      });

    node.exit().remove();

    // Update the links...
    const link = this.innerG.selectAll('path.link').data(links,
      function key(d) { return d ? d.target.id : this.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('id', d => d.target.id)
      .attr('d', d => makeLink({ x: d.source.y, y: d.source.x }, { x: d.target.y, y: d.target.x }));

    // Transition exiting nodes to the parent's new position.
    link.exit().remove();
  }
}
