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

import { tree } from 'd3-hierarchy';
import { transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';
import { select, selectAll, event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { makeLink, finalLink, translate } from './treeUtils';
import parseChainscript from './parseChainscript';
import { findExtraLinks, findExtraNodes, loadRef } from './nodes';

const margin = { top: 20, right: 120, bottom: 20, left: 120 };
const height = 800 - margin.top - margin.bottom;

export default class ChainTree {
  constructor(element, options) {
    this.options = options;
    this.tree = tree();

    this.svg = select(element).append('svg');
    this.innerG = this.svg.append('g');
    this.zoomed = () => this.innerG.attr('transform', event.transform);
  }

  display(chainscript) {
    if (chainscript && chainscript.length) {
      const root = parseChainscript(chainscript);
      this.update(root);
    } else {
      this.update(null);
    }
  }

  update(root) {
    const self = this;
    const nodes = root ? root.descendants() : [];
    this.links = (root ? root.links() : []).concat(findExtraLinks(root));
    const extraNodes = findExtraNodes(this.links, nodes).map((n, index) =>
      Object.assign(n, {
        x:
          this.options.polygonSize.height / 2 +
          index *
            (this.options.polygonSize.height * this.options.verticalSpacing),
        y: this.options.getArrowLength(),
        y0: 0
      })
    );

    // init tree
    this.initTree(root, extraNodes);

    // draw links
    this.displayCurrentMapLinks();

    // Update the nodes...
    const node = this.innerG
      .selectAll('g.node.base')
      .data(nodes, function key(d) {
        return d ? d.id : this.id;
      });
    // Enter any new nodes at the parent's previous position.
    const nodeSelection = node
      .enter()
      .append('g')
      .attr('class', d => ['node base'].concat(d.data.link.meta.tags).join(' '))
      .attr('id', d => d.id)
      .attr('transform', d => {
        const origin = d.parent && d.parent.x0 ? d.parent : root;
        return translate(origin.x0, origin.y0);
      })
      .on('click', function onClick(d) {
        selectAll('g.node').classed('selected', false);
        select(this).classed('selected', true);
        if (d.data.link.meta.refs) {
          self.displayNodeLinks(d);
        } else {
          self.displayCurrentMapLinks();
        }
        if (d.data.parentRef != null) {
          self.drawForeignChildRef(d);
        }
        self.options.onclick(
          d,
          () => {
            self.displayCurrentMapLinks();
            self.innerG.selectAll('g.node.selected').classed('selected', false);
          },
          this
        );
      });
    // Draw nodes
    this.drawNodes(nodeSelection);
    // Transition all exiting nodes to the parent's new position.
    const nodeExit = node.exit(); // .transition(treeTransition);
    nodeExit.select('text').style('fill-opacity', 1e-6);
    nodeExit.attr('transform', () => translate(0, 0)).remove();

    // Update the extra nodes...
    const extraNode = this.innerG
      .selectAll('g.node.ref')
      .data(extraNodes, function key(d) {
        return d ? d.id : this.id;
      });
    // Enter any extra nodes at the parent's previous position.
    const extraNodeSelection = extraNode
      .enter()
      .append('g')
      .attr('class', () => 'node ref')
      .attr('id', d => d.id)
      .attr('transform', d => translate(d.x, d.y))
      .on('click', function onClick(d) {
        selectAll('g.node').classed('selected', false);
        select(this).classed('selected', true);
        self.displayNodeLinks(d);
        self.drawAncestorsRef(d);
        self.options.onclick(
          d,
          () => {
            self.displayCurrentMapLinks();
            self.innerG.selectAll('g.node.selected').classed('selected', false);
          },
          this
        );
      });
    // Draw extra nodes
    this.drawNodes(extraNodeSelection);
    // Transition all exiting nodes to the parent's new position.
    const extraNodeExit = extraNode.exit(); // .transition(treeTransition);
    extraNodeExit.select('text').style('fill-opacity', 1e-6);
    extraNodeExit.attr('transform', () => translate(0, 0)).remove();

    // Draw init link
    if (root) {
      this.drawInit(root);
    }
    // Draw foreign child references
    nodes
      .filter(n => n.data.parentRef != null)
      .map(n => this.drawForeignChildRef(n));
  }

  initTree(root, extraNodes) {
    const nodes = root ? root.descendants() : [];
    const polygon = this.options.polygonSize;
    const maxDepth = Math.max(nodes, x => x.depth) || 0;
    const treeWidth =
      maxDepth * (polygon.width + this.options.getArrowLength()) +
      this.options.getArrowLength();
    const extraNodesWidth = extraNodes.length
      ? this.options.getArrowLength() * 3
      : 0;
    const ancestorsAndChildWidth = polygon.width * 4;
    const computedWidth = Math.max(
      treeWidth + extraNodesWidth + ancestorsAndChildWidth,
      500
    );
    const branchesCount = nodes.reduce(
      (pre, cur) =>
        pre + (cur.children ? Math.max(cur.children.length - 1, 0) : 0),
      1
    );
    const computedHeight =
      Math.max(branchesCount, extraNodes.length) *
      polygon.height *
      this.options.verticalSpacing;

    this.tree.size([computedHeight, treeWidth]);
    this.svg
      .attr(
        'width',
        this.options.zoomable
          ? 1200
          : computedWidth + margin.right + margin.left
      )
      .attr(
        'height',
        (this.options.zoomable ? height : computedHeight) +
          margin.top +
          margin.bottom
      );

    // Compute the new tree layout.
    if (root) {
      root.x0 = computedHeight / 2;
      root.y0 = extraNodesWidth;
      this.tree(root);
      root.each(node => {
        node.y += root.y0 + this.options.getArrowLength();
      });
    }

    if (this.options.zoomable) {
      this.svg.call(zoom().on('zoom', this.zoomed));
    } else {
      this.svg.on('.zoom', null);
    }
    this.innerG.attr('transform', () => translate(margin.top, margin.left));
  }

  drawInit(root) {
    this.innerG.selectAll('#init-link').remove();
    this.innerG
      .append('path')
      .attr('class', 'link init')
      .attr('id', 'init-link')
      .attr('d', makeLink({ x: root.x, y: root.y0 }, root, 15));

    this.innerG
      .append('text')
      .attr('dx', 20)
      .attr('dy', '-0.3em')
      .append('textPath')
      .attr('class', 'textpath')
      .attr('xlink:href', '#init-link')
      .text('init');
  }

  drawForeignRef(refNode, onClick, link, rect, linkLabel) {
    const xRadius = 15;
    const yRadius = 15;
    const boxOpacity = 0.7;

    this.innerG
      .append('path')
      .attr('class', 'link ref')
      .attr('id', 'ref-link')
      .attr('d', link)
      .on('click', onClick);

    this.innerG
      .append('rect')
      .attr('y', rect.y)
      .attr('x', rect.x)
      .attr('ry', xRadius)
      .attr('rx', yRadius)
      .attr('fill-opacity', boxOpacity)
      .attr('width', rect.width)
      .attr('height', rect.height)
      .attr('class', 'refLinkBox')
      .on('click', onClick);

    this.innerG
      .append('text')
      .attr('id', 'linkLabelRef')
      .attr('dx', linkLabel.dx)
      .attr('dy', linkLabel.dy)
      .text(this.options.getRefLinkText(refNode))
      .on('click', onClick);
  }

  drawForeignChildRef(refNode) {
    const self = this;
    const foreignLink = makeLink(
      { x: refNode.x, y: refNode.y + this.options.getArrowLength() },
      { x: refNode.x, y: refNode.y + this.options.getArrowLength() * 2 },
      15
    );
    const onClick = () => {
      this.innerG.selectAll('g.childRef').attr('class', 'node base');
      loadRef(self.options.agentUrl, refNode, this.links).then(cs =>
        self.display(cs, self.options)
      );
    };
    const rect = {
      x: refNode.y + this.options.getArrowLength() * 2 + 10,
      y: refNode.x - this.options.getBoxSize().height / 2 - 2,
      width: this.options.getArrowLength() * 2 + 10,
      height: this.options.getBoxSize().height
    };
    const linkLabel = {
      dx: refNode.y + this.options.getArrowLength() * 2 + 15,
      dy: refNode.x + 2
    };
    this.drawForeignRef(refNode, onClick, foreignLink, rect, linkLabel);

    return refNode;
  }

  drawAncestorsRef(refNode) {
    const self = this;
    const foreignLink = makeLink({ x: refNode.x, y: refNode.y0 }, refNode, 20);
    const onClick = () =>
      loadRef(self.options.agentUrl, refNode, this.links).then(cs =>
        self.display(cs, self.options)
      );
    const rect = {
      x: this.options.getArrowLength() / 2 - 5,
      y: refNode.x + this.options.getArrowLength() / 2 + 5,
      width: this.options.getArrowLength() * 2 + 10,
      height: this.options.getBoxSize().height
    };
    const linkLabel = {
      dx: this.options.getArrowLength() / 2,
      dy: refNode.x + this.options.getArrowLength() - 17
    };

    this.innerG.selectAll('path#ref-link').remove();
    this.innerG.selectAll('rect.refLinkBox').remove();
    this.innerG.selectAll('#linkLabelRef').remove();
    this.drawForeignRef(refNode, onClick, foreignLink, rect, linkLabel);
  }

  drawNodes(nodeEnter) {
    const polygon = this.options.polygonSize;
    const treeTransition = transition()
      .duration(this.options.duration)
      .ease(easeLinear);

    nodeEnter
      .append('polygon')
      .attr(
        'points',
        `0,${polygon.height / 4} ${polygon.width / 2},${polygon.height / 2} ` +
          `${polygon.width},${polygon.height /
            4} ${polygon.width},${-polygon.height / 4} ` +
          `${polygon.width / 2},${-polygon.height / 2} 0,${-polygon.height / 4}`
      );

    nodeEnter
      .append('rect')
      .attr('y', -(this.options.getBoxSize().height / 2))
      .attr('width', polygon.width)
      .attr('height', this.options.getBoxSize().height)
      .style('fill-opacity', 1e-6);

    nodeEnter
      .append('text')
      .attr('class', 'shortHash')
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('text-anchor', 'begin')
      .text(this.options.getSegmentText)
      .style('fill-opacity', 1e-6);

    this.innerG
      .selectAll('g.node.base')
      .filter(n => (n.data.parentRef != null) === true)
      .attr('class', 'node base childRef');

    // Transition all the nodes to their new position.
    const nodeUpdate = this.svg.selectAll('g.node').transition(treeTransition);
    nodeUpdate.attr('transform', d => translate(d.x, d.y));
    nodeUpdate.select('text').style('fill-opacity', 1);
    nodeUpdate.select('rect').style('fill-opacity', 1);
  }

  drawLinks(links) {
    const polygon = this.options.polygonSize;
    const treeTransition = transition()
      .duration(this.options.duration)
      .ease(easeLinear);

    this.innerG.selectAll('path.link').remove();
    const link = this.innerG.selectAll('path.link').data(links, d => d);

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('id', d => `link-${d.source.id}-${d.target.id}`);

    // Transition links to their new position.
    const linkUpdate = this.innerG
      .selectAll('path.link:not(.init):not(.ref)')
      .transition(treeTransition);
    linkUpdate.attr('d', d => finalLink(d, 15));

    link.exit().remove();

    // Add a transition label to the link
    this.innerG.selectAll('text.actionLabel').remove();
    link
      .enter()
      .insert('text')
      .attr('class', 'actionLabel')
      .attr('dx', polygon.width + 20)
      .attr('dy', '-0.3em')
      .append('textPath')
      .attr('class', 'textpath')
      .attr('xlink:href', d => `#link-${d.source.id}-${d.target.id}`)
      .text(this.options.getLinkText);
  }

  displayNodeLinks(node) {
    const relatedLinks = this.links.filter(
      l => l.source.id === node.id || l.target.id === node.id
    );

    // remove ref links labels
    this.innerG.selectAll('rect.refLinkBox').remove();
    this.innerG.selectAll('#linkLabelRef').remove();
    if (relatedLinks) {
      // make unrelated nodes transparent
      this.innerG.selectAll('g.node').style('fill-opacity', 1);
      const selectedNodes = this.innerG
        .selectAll('g.node')
        .filter(d => {
          const isSourceOrTarget = relatedLinks.find(
            l => l.source.id === d.id || l.target.id === d.id
          );
          return isSourceOrTarget === undefined;
        })
        .style('fill-opacity', 0.3);

      this.innerG.selectAll('g.node rect').style('fill-opacity', 1);
      selectedNodes.selectAll('rect').style('fill-opacity', 0.3);

      // draw related links
      this.drawLinks(relatedLinks);
    }
  }

  displayCurrentMapLinks() {
    // remove ref links labels
    this.innerG.selectAll('rect.refLinkBox').remove();
    this.innerG.selectAll('#linkLabelRef').remove();

    // make nodes and links transparent
    let selectNode = this.innerG.selectAll('g.base');
    selectNode.style('fill-opacity', 1);
    let selectNodeRect = this.innerG.selectAll('g.base rect');
    selectNodeRect.style('fill-opacity', 1);
    selectNode = this.innerG.selectAll('g.ref');
    selectNode.style('fill-opacity', 0.3);
    selectNodeRect = this.innerG.selectAll('g.ref rect');
    selectNodeRect.style('fill-opacity', 0.3);

    // if the depth or the height of a node are 0, it belongs to the current map
    const currentMapLinks = this.links.filter(
      l => l.source.depth !== 0 || l.source.height !== 0
    );

    // draw related links
    this.drawLinks(currentMapLinks);
    const rootNode = currentMapLinks
      .map(l => l.source)
      .find(n => n.parent === null);
    if (rootNode) {
      this.drawInit(rootNode);
    }
  }
}
