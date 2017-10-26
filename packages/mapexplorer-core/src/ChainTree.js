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

import { tree, hierarchy } from "d3-hierarchy";
import { transition } from "d3-transition";
import { easeLinear } from "d3-ease";
import { select, selectAll, event } from "d3-selection";
import { zoom } from "d3-zoom";
import { max } from "d3-array";
import { makeLink, finalLink, translate } from "./treeUtils";
import parseChainscript from "./parseChainscript";

const margin = { top: 20, right: 120, bottom: 20, left: 120 };
const height = 800 - margin.top - margin.bottom;

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
        source: r.linkHash,
        target: node.id
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
    const source = nodes.find(e => e.id === refs[i].source);
    const target = nodes.find(e => e.id === refs[i].target);
    if (source && target) {
      extraLinks.push({ source, target });
    } else if (!source) {
      let newSourceNode = extraLinks
        .map(l => l.source.data)
        .find(s => s.meta.linkHash === refs[i].source);
      if (!newSourceNode) {
        newSourceNode = hierarchy(
          {
            meta: {
              linkHash: refs[i].source
            }
          },
          () => null
        );
      }
      extraLinks.push({
        source: Object.assign(newSourceNode, { id: refs[i].source }),
        target
      });
    }
  }

  return extraLinks;
}

function findExtraNodes(links, nodes) {
  const extraNodes = [];
  links.map(l => {
    if (!nodes.find(n => n.id === l.source.id)) {
      extraNodes.push(l.source);
    }
    return l;
  });
  return extraNodes;
}

export default class ChainTree {
  constructor(element) {
    this.tree = tree();

    this.svg = select(element).append("svg");
    this.innerG = this.svg.append("g");

    this.zoomed = () => this.innerG.attr("transform", event.transform);
  }

  display(chainscript, options) {
    this.options = options;
    if (chainscript && chainscript.length) {
      const root = parseChainscript(chainscript);
      this.update(root, options);
    } else {
      this.update(null, options);
    }
  }

  update(root, options) {
    const self = this;
    const polygon = options.polygonSize;
    const nodes = root ? root.descendants() : [];
    const links = root ? root.links() : [];
    const extraLinks = findExtraLinks(root);
    const extraNodes = findExtraNodes(extraLinks, nodes).map((n, index) => {
      return Object.assign(n, {
        x:
          polygon.height / 2 +
          index * (polygon.height * options.verticalSpacing),
        y: 0
      });
    });
    console.log(
      "RESULT LINKS == ",
      extraLinks,
      "\nRESULT NODES ==",
      extraNodes,
      "\nBASE NODES == ",
      nodes
    );
    const maxDepth = max(nodes, x => x.depth) || 0;
    const computedWidth = Math.max(
      (maxDepth + 1) * (polygon.width + options.getArrowLength()),
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
      options.verticalSpacing;

    const treeWidth =
      computedWidth - (polygon.width + options.getArrowLength());
    this.tree.size([computedHeight, treeWidth]);
    this.svg
      .attr(
        "width",
        options.zoomable
          ? 1200
          : computedWidth +
            margin.right +
            margin.left +
            options.getArrowLength()
      )
      .attr(
        "height",
        (options.zoomable ? height : computedHeight) +
          margin.top +
          margin.bottom
      );

    // Compute the new tree layout.
    if (root) {
      root.x0 = computedHeight / 2;
      root.y0 = options.getArrowLength() * 2;
      this.tree(root);
      root.each(node => {
        node.y += polygon.width + options.getArrowLength() * 2;
      });
    }

    if (options.zoomable) {
      this.svg.call(zoom().on("zoom", this.zoomed));
    } else {
      this.svg.on(".zoom", null);
    }
    this.innerG.attr("transform", () => translate(margin.top, margin.left));

    // Update the links...
    const link = this.innerG
      .selectAll("path.link")
      .data(links, function key(d) {
        console.log("---", d);
        return d ? d.target.id : this.id;
      });

    // draw links
    this.drawLinks(link);

    // Update the nodes...
    const node = this.innerG.selectAll("g.node").data(nodes, function key(d) {
      return d ? d.id : this.id;
    });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", d => ["node base"].concat(d.data.link.meta.tags).join(" "))
      .attr("id", d => d.id)
      .attr("transform", d => {
        const origin = d.parent && d.parent.x0 ? d.parent : root;
        return translate(origin.x0, origin.y0);
      })
      .on("click", function onClick(d) {
        selectAll("g.node").classed("selected", false);
        select(this).classed("selected", true);
        console.log("clicked", d);
        if (d.data.link.meta.refs) {
          self.displayExtraLinks(d, extraLinks);
        } else {
          self.displayOriginalLinks(links);
        }
        options.onclick(
          d,
          () => {
            self.displayOriginalLinks(links);
            self.innerG.selectAll("g.node.selected").classed("selected", false);
          },
          this
        );
      });
    // Draw nodes
    this.drawNodes(nodeEnter);

    // Update the extra nodes...
    const extraNode = this.innerG
      .selectAll("g.node")
      .data(extraNodes, function key(d) {
        return d ? d.id : this.id;
      });

    // Enter any extra nodes at the parent's previous position.
    const extraNodeEnter = extraNode
      .enter()
      .append("g")
      .attr("class", () => "node ref")
      .attr("id", d => d.id)
      .attr("transform", d => {
        return translate(d.x, d.y);
      })
      .on("click", function onClick(d) {
        selectAll("g.node").classed("selected", false);
        select(this).classed("selected", true);
        console.log("CLICKED REF SEGMENT", d);
        self.displayExtraLinks(d, extraLinks);
      });
    //Draw extra nodes
    this.drawNodes(extraNodeEnter);

    // Transition all exiting nodes to the parent's new position.
    const nodeExit = node.exit(); // .transition(treeTransition);
    nodeExit.select("text").style("fill-opacity", 1e-6);
    nodeExit.attr("transform", () => translate(0, 0)).remove();

    this.drawInit(root);
  }

  drawInit(root) {
    this.innerG
      .append("path")
      .attr("class", "link init")
      .attr("id", "init-link")
      .attr("d", makeLink({ x: root.x, y: root.y0 }, root, 15));

    this.innerG
      .append("text")
      .attr("dx", 20)
      .attr("dy", "-0.3em")
      .append("textPath")
      .attr("class", "textpath")
      .attr("xlink:href", "#init-link")
      .text("init");
  }

  drawNodes(nodeEnter, type) {
    const polygon = this.options.polygonSize;
    const treeTransition = transition()
      .duration(this.options.duration)
      .ease(easeLinear);

    nodeEnter
      .append("polygon")
      .attr(
        "points",
        `0,${polygon.height / 4} ${polygon.width / 2},${polygon.height / 2} ` +
          `${polygon.width},${polygon.height /
            4} ${polygon.width},${-polygon.height / 4} ` +
          `${polygon.width / 2},${-polygon.height / 2} 0,${-polygon.height / 4}`
      );

    nodeEnter
      .append("rect")
      .attr("y", -(this.options.getBoxSize().height / 2))
      .attr("width", polygon.width)
      .attr("height", this.options.getBoxSize().height)
      .style("fill-opacity", 1e-6);

    nodeEnter
      .append("text")
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("text-anchor", "begin")
      .text(this.options.getSegmentText)
      .style("fill-opacity", 1e-6);

    // Transition all the nodes to their new position.
    const nodeUpdate = this.svg.selectAll("g.node").transition(treeTransition);
    nodeUpdate.attr("transform", d => translate(d.x, d.y));
    nodeUpdate.select("text").style("fill-opacity", 1);
    nodeUpdate.select("rect").style("fill-opacity", 1);
  }

  drawLinks(link) {
    const polygon = this.options.polygonSize;
    const treeTransition = transition()
      .duration(this.options.duration)
      .ease(easeLinear);

    link
      .enter()
      .insert("text")
      .attr("dx", polygon.width + 20)
      .attr("dy", "-0.3em")
      .append("textPath")
      .attr("class", "textpath")
      .attr("xlink:href", d => `#link-${d.target.id}`)
      .text(this.options.getLinkText);

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("id", d => `link-${d.target.id}`);

    // Transition links to their new position.
    const linkUpdate = this.innerG
      .selectAll("path.link:not(.init)")
      .transition(treeTransition);

    linkUpdate.attr("d", d => finalLink(d, 15));

    link.exit().remove();
  }

  displayExtraLinks(node, links) {
    const relatedLinks = links.filter(
      l => l.source.id === node.id || l.target.id === node.id
    );
    console.log("RELATED LINKS = ", relatedLinks);

    if (relatedLinks) {
      // make nodes THAT ARE NOT CONCERNED transparent
      this.innerG.selectAll("g.node").style("fill-opacity", 1);
      const selectedNodes = this.innerG
        .selectAll("g.node")
        .filter((d, i) => {
          const isSourceOrTarget = relatedLinks.find(
            l => l.source.id === d.id || l.target.id === d.id
          );
          return isSourceOrTarget === undefined;
        })
        .style("fill-opacity", 0.3);

      this.innerG.selectAll("g.node rect").style("fill-opacity", 1);
      selectedNodes.selectAll("rect").style("fill-opacity", 0.3);

      //draw related links
      const extraLinks = this.innerG
        .selectAll("path.link")
        .data(relatedLinks, function key(d) {
          return d ? d.target.id : this.id;
        });
      this.drawLinks(extraLinks);
    }
  }

  displayOriginalLinks(links) {
    // make nodes and links transparent
    let selectNode = this.innerG.selectAll("g.base");
    selectNode.style("fill-opacity", 1);
    let selectNodeRect = this.innerG.selectAll("g.base rect");
    selectNodeRect.style("fill-opacity", 1);
    selectNode = this.innerG.selectAll("g.ref");
    selectNode.style("fill-opacity", 0.3);
    selectNodeRect = this.innerG.selectAll("g.ref rect");
    selectNodeRect.style("fill-opacity", 0.3);

    //draw related links
    const link = this.innerG
      .selectAll("path.link")
      .data(links, function key(d) {
        return d ? d.target.id : this.id;
      });
    this.drawLinks(link);
    this.drawInit(links.map(l => l.source).find(n => n.parent === null));
  }
}
