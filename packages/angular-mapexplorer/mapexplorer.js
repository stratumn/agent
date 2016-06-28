/**
@toc

@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
TODO

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
TODO

@dependencies
TODO

@usage
partial / html:
TODO

controller / js:
TODO

//end: usage
*/

'use strict';

angular.module('stratumn.angular-mapexplorer', ['rt.debounce']).directive('stMapExplorer', stMapExplorer);

stMapExplorer.$inject = ['debounce'];

function stMapExplorer(debounce) {

	var margin = {top: 20, right: 120, bottom: 20, left: 120},
		width = 1680 - margin.right - margin.left,
		height = 800 - margin.top - margin.bottom;

	var defaultOptions = {
		withArgs: false,
		getSegmentText: function(node) {
			return node.meta.linkHash.slice(0, 3) + '...' + node.meta.linkHash.slice(61);
		},
		getLinkText: function(node) {
			return node.target.link.meta.action + (this.withArgs ? '(' + node.target.link.meta.arguments.join(', ') + ')' : '');
		},
		duration: 750
	};

	function load(scope) {
		StratumnSDK.getApplication(scope.application)
			.then(function(app) {
				return app.getMap(scope.mapId)
			})
			.then(function(res) {
				return Promise.all(res.map(function(link) { return link.load(); }));
			})
			.then(function(res) {
				var root = parse(scope, res);

				root.x0 = height / 2;
				root.y0 = 0;

				update(scope, root);
			});
	}

	function parse(scope, chainMap) {

		chainMap.forEach(function(segment) {
			if (scope.segmentsByHash[segment.meta.linkHash]) {
				return;
			}

			if (!segment.link.meta.prevLinkHash) {
				scope.root = segment;
			}
			scope.segmentsByHash[segment.meta.linkHash] = segment;
		});

		if (!scope.root) {
			scope.root = chainMap[0];
		}

		chainMap.forEach(function(segment) {

			if (segment.link.meta.prevLinkHash) {
				var parent = scope.segmentsByHash[segment.link.meta.prevLinkHash];
				if (!parent) {
					throw 'Missing parent with linkHash ' + segment.meta.linkHash;
				}
				parent.children = parent.children || [];

				['children', '_children'].forEach(function(meth) {
					if (parent[meth] && !parent[meth].find(function(elt) {
							return elt.meta.linkHash === segment.meta.linkHash;
						})) {
						parent[meth].push(segment);
					}
				});
			}
		});

		return scope.root;
	}

	function translate(x, y) {
		return "translate(" + y + "," + x + ")";
	}

	function update(scope, source) {

		// Compute the new tree layout.
		var nodes = scope.tree.nodes(source).reverse(),
			links = scope.tree.links(nodes);

		// Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = Math.min(d.depth * 100, d.y); });

		// Update the nodes…
		var node = scope.svg.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++scope.i); });

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g")
			.attr("class", function(d) {
				return (['node'].concat(d.link.meta.tags)).join(' ');
			})
			.attr("transform", function(d) {
				var origin = d.parent && d.parent.x0 ? d.parent : source;
				return translate(origin.x0, origin.y0);
			})
			.on("click", click);

		nodeEnter.append("circle")
			.attr("r", 1e-6);

		nodeEnter.append("text")
			.attr("x", 0)
			.attr("dy", "-1em")
			.attr('text-anchor', 'middle')
			.text(scope.options.getSegmentText)
			.style("fill-opacity", 1e-6);

		// Transition nodes to their new position.
		var nodeUpdate = node.transition()
			.duration(scope.options.duration)
			.attr("transform", function(d) { return translate(d.x, d.y); });

		nodeUpdate.select("circle")
			.attr("r", 4.5);

		nodeUpdate.select("text")
			.style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition()
			.duration(scope.options.duration)
			.attr("transform", function() { return translate(source.x, source.y); })
			.remove();

		nodeExit.select("circle")
			.attr("r", 1e-6);

		nodeExit.select("text")
			.style("fill-opacity", 1e-6);

		// Update the links…
		var link = scope.svg.selectAll("path.link")
			.data(links, function(d) { return d.target.id; });

		link.enter().insert("text")
			.attr("x", 40)
			.attr("dy", "-0.5em")
			.append("textPath")
			.attr("class", "textpath")
			.attr("xlink:href",  function(d) { return "#" + d.target.id; } )
			.text(scope.options.getLinkText);

		// Enter any new links at the parent's previous position.
		link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("id", function(d) { return d.target.id; })
			.attr("d", function(d) {
				var o = d.source && d.source.x0 ? {x: d.source.x0, y: d.source.y0} : {x: source.x0, y: source.y0};
				return scope.diagonal({source: o, target: o});
			});
		// Transition links to their new position.
		link.transition()
			.duration(scope.options.duration)
			.attr("d", scope.diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition()
			.duration(scope.options.duration)
			.attr("d", function(d) {
				var o = {x: source.x, y: source.y};
				return scope.diagonal({source: o, target: o});
			})
			.remove();

		// Stash the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	}

	// Toggle children on click.
	function click(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		update(d);
	}

	return {
		restrict: 'E',
		scope: {
			application: '=',
			mapId: '=',
			refresh: '=',
			options: '='
		},
		template: '<svg></svg>',
		link: function(scope, element) {

			scope.options = Object.assign({}, defaultOptions, scope.options);
			scope.i = 0;
			scope.root = null;
			scope.segmentsByHash = {};
			scope.tree = d3.layout.tree().size([height, width]);
			scope.diagonal = d3.svg.diagonal()
				.projection(function(d) { return [d.y, d.x]; });

			scope.svg = d3.select(element.find("svg")[0])
				.attr("width", width + margin.right + margin.left)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var fn = debounce(100, load, true);

			scope.$watchGroup(['application', 'mapId', 'refresh'], function() {
				if (!scope.mapId) {
					return;
				}

				fn(scope);
			});
		}
	};
}
