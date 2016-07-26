import { makeLink, finalLink, translate } from './treeUtils';
import parseChainscript from './parseChainscript';
import d3 from 'd3';

const margin = { top: 20, right: 120, bottom: 20, left: 120 };
const height = 800 - margin.top - margin.bottom;

const polygon = { width: 78, height: 91 };
const box = { width: polygon.width, height: 25 };
const arrowLength = polygon.width;

export default class ChainTree {
  constructor(element, options) {
    this.element = element;
    this.options = options;

    this.tree = d3.tree();
    this.transition = d3.transition()
      .duration(this.options.duration)
      .ease(d3.easeLinear);

    this.svg = d3.select(element.find('svg')[0]);
    this.innerG = this.svg.append('g')
      .attr('transform', () => translate(margin.top, margin.left));
  }

  display(chainscript) {
    if (chainscript && chainscript.length) {
      const root = parseChainscript(chainscript);
      root.x0 = height / 2;
      root.y0 = 0;
      this._update(root, root.descendants(), root.links());
    } else {
      this._update(null, [], []);
    }
  }

  _update(root, nodes, links) {
    const maxDepth = d3.max(nodes, x => x.depth) || 0;
    const computedWidth = Math.max(maxDepth * (polygon.width + arrowLength), 500);

    this.tree.size([height, computedWidth]);
    this.svg
      .attr('width', computedWidth + margin.right + margin.left + arrowLength)
      .attr('height', height + margin.top + margin.bottom);

    // Compute the new tree layout.
    if (root) {
      this.tree(root);
    }

    root.each(node => { node.y += arrowLength; });

    // Update the nodes...
    const node = this.innerG.selectAll('g.node').data(nodes,
      function key(d) { return d ? d.id : this.id; });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('class', d => ['node'].concat(d.data.link.meta.tags).join(' '))
      .attr('id', d => d.id)
      .attr('transform', d => {
        const origin = d.parent && d.parent.x0 ? d.parent : root;
        return translate(origin.x0, origin.y0);
      })
      .on('click', this.options.onclick);

    nodeEnter.append('polygon').attr('points',
      `0,${polygon.height / 4} ${polygon.width / 2},${polygon.height / 2} ` +
      `${polygon.width},${polygon.height / 4} ${polygon.width},${-polygon.height / 4} ` +
      `${polygon.width / 2},${-polygon.height / 2} 0,${-polygon.height / 4}`);

    nodeEnter.append('rect')
      .attr('y', -(box.height / 2))
      .attr('width', polygon.width)
      .attr('height', box.height)
      .style('fill-opacity', 1e-6);

    nodeEnter.append('text')
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('text-anchor', 'begin')
      .text(this.options.getSegmentText)
      .style('fill-opacity', 1e-6);

    // Transition nodes to their new position.
    const nodeUpdate = this.svg.selectAll('g.node').transition(this.transition);

    nodeUpdate.attr('transform', d => translate(d.x, d.y));
    nodeUpdate.select('text').style('fill-opacity', 1);
    nodeUpdate.select('rect').style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit(); // .transition(this.transition);
    nodeExit.select('text').style('fill-opacity', 1e-6);
    nodeExit.attr('transform', () => translate(0, 0)).remove();

    // Update the links...
    const link = this.innerG.selectAll('path.link').data(links,
      function key(d) { return d ? d.target.id : this.id; });

    link.enter().insert('text')
      .attr('dx', polygon.width + 20)
      .attr('dy', '-0.3em')
      .append('textPath')
      .attr('class', 'textpath')
      .attr('xlink:href', d => `#link-${d.target.id}`)
      .text(this.options.getLinkText);

    // Enter any new links at the parent's previous position.
    link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('id', d => `link-${d.target.id}`)
      .attr('d', d => finalLink(d, 15));
      // .attr('d', d => {
      //   const o = d.source && d.source.x0 ? { x: d.source.x0, y: d.source.y0 } :
      //   { x: root.x0, y: root.y0 };
      //   return makeLink(o);
      // });

    // const linkUpdate = this.innerG.selectAll('path.link').transition(this.transition);

    // Transition links to their new position.
    // linkUpdate.attr('d', d => finalLink(d, 15));

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(this.transition)
      .attr('d', () => makeLink({ x: 0, y: 0 }))
      .remove();

    this._drawInit(root);
  }

  _drawInit(root) {
    this.innerG.append('path')
      .attr('class', 'link')
      .attr('id', 'init-link')
      .attr('d', makeLink({ x: root.x0, y: root.y0 }, root, 15));

    this.innerG.append('text')
      .attr('dx', 20)
      .attr('dy', '-0.3em')
      .append('textPath')
      .attr('class', 'textpath')
      .attr('xlink:href', '#init-link')
      .text('init');
  }
}
