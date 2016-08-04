import { makeLink, finalLink, translate } from './treeUtils';
import parseChainscript from './parseChainscript';
import { tree } from 'd3-hierarchy';
import { transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';
import { select, selectAll, event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { max } from 'd3-array';

const margin = { top: 20, right: 120, bottom: 20, left: 120 };
const height = 800 - margin.top - margin.bottom;

const polygon = { width: 78, height: 91 };
const box = { width: polygon.width, height: 25 };
const arrowLength = polygon.width;

export default class ChainTree {
  constructor(element) {
    this.tree = tree();
    this.transition = transition()
      .duration(this.options.duration)
      .ease(easeLinear);

    this.svg = select(element.find('svg')[0]);
    this.innerG = this.svg.append('g')
      .attr('transform', () => translate(margin.top, margin.left));

    this.zoomed = () => this.innerG.attr('transform', event.transform);
  }

  display(chainscript, options) {
    if (chainscript && chainscript.length) {
      const root = parseChainscript(chainscript);
      this._update(root, options);
    } else {
      this._update(null, options);
    }
  }

  _update(root, options) {
    const self = this;
    const nodes = root ? root.descendants() : [];
    const links = root ? root.links() : [];
    const maxDepth = max(nodes, x => x.depth) || 0;
    const computedWidth = Math.max(maxDepth * (polygon.width + arrowLength), 500);

    const branchesCount = nodes.reduce(
      (pre, cur) => pre + (cur.children ? Math.max(cur.children.length - 1, 0) : 0),
      1
    );
    const computedHeight = branchesCount * polygon.height * this.options.verticalSpacing;

    this.tree.size([computedHeight, computedWidth]);
    this.svg
      .attr('width',
        options.zoomable ? 1200 : computedWidth + margin.right + margin.left + arrowLength)
      .attr('height',
        (options.zoomable ? height : computedHeight) + margin.top + margin.bottom);

    // Compute the new tree layout.
    if (root) {
      root.x0 = computedHeight / 2;
      root.y0 = 0;
      this.tree(root);
      root.each(node => { node.y += arrowLength; });
    }

    if (options.zoomable) {
      this.svg.call(zoom().on('zoom', this.zoomed));
    } else {
      this.svg.on('zoom', null);
    }

    // Update the links...
    const link = this.innerG.selectAll('path.link').data(links,
      function key(d) { return d ? d.target.id : this.id; });

    link.enter().insert('text')
      .attr('dx', polygon.width + 20)
      .attr('dy', '-0.3em')
      .append('textPath')
      .attr('class', 'textpath')
      .attr('xlink:href', d => `#link-${d.target.id}`)
      .text(options.getLinkText);

    // Enter any new links at the parent's previous position.
    link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('id', d => `link-${d.target.id}`);
    //  .attr('d', d => finalLink(d, 15));
    // .attr('d', d => {
    //   const o = d.source && d.source.x0 ? { x: d.source.x0, y: d.source.y0 } :
    //   { x: root.x0, y: root.y0 };
    //   return makeLink(o);
    // });

    const linkUpdate = this.innerG.selectAll('path.link:not(.init)').transition(this.transition);

    // Transition links to their new position.
    linkUpdate.attr('d', d => finalLink(d, 15));

    link.exit().remove();

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
      .on('click', function onClick(d) {
        selectAll('g.node')
          .classed('selected', false);
        select(this)
          .classed('selected', true);
        options.onclick(d, () => {
          self.innerG.selectAll('g.node.selected').classed('selected', false);
        });
      });

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
      .text(options.getSegmentText)
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

    this._drawInit(root);
  }

  _drawInit(root) {
    this.innerG.append('path')
      .attr('class', 'link init')
      .attr('id', 'init-link')
      .attr('d', makeLink({ x: root.x, y: root.y0 }, root, 15));

    this.innerG.append('text')
      .attr('dx', 20)
      .attr('dy', '-0.3em')
      .append('textPath')
      .attr('class', 'textpath')
      .attr('xlink:href', '#init-link')
      .text('init');
  }
}
