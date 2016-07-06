/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _merkle_path_tree = __webpack_require__(1);

	var _merkle_path_tree2 = _interopRequireDefault(_merkle_path_tree);

	var _mapexplorer = __webpack_require__(4);

	var _mapexplorer2 = _interopRequireDefault(_mapexplorer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	angular.module('stratumn.angular-mapexplorer', ['rt.debounce']).directive('stMapExplorer', _mapexplorer2.default).directive('stMerklePathTree', _merkle_path_tree2.default);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stMerklePathTree;

	var _tree_utils = __webpack_require__(2);

	var _compact_hash = __webpack_require__(3);

	var _compact_hash2 = _interopRequireDefault(_compact_hash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function stMerklePathTree() {
	  var margin = { top: 50, right: 20, bottom: 50, left: 20 };
	  var height = 800 - margin.top - margin.bottom;
	  var width = 600 - margin.left - margin.right;

	  function parse(merklePath) {
	    var nodes = [];

	    merklePath.forEach(function (path, index) {
	      nodes.push({
	        id: path.left + '-' + index,
	        name: path.left,
	        parentId: path.parent + '-' + (index + 1)
	      });
	      if (path.right) {
	        nodes.push({
	          id: path.right + '-' + index,
	          name: path.right,
	          parentId: path.parent + '-' + (index + 1)
	        });
	      }
	    });

	    var root = merklePath[merklePath.length - 1].parent;
	    nodes.push({
	      id: root + '-' + merklePath.length,
	      name: root
	    });

	    return d3.stratify()(nodes);
	  }

	  function display(merklePath, scope) {
	    if (merklePath && merklePath.length) {
	      scope.root = parse(merklePath);
	      update(scope, scope.root.descendants(), scope.root.links());
	    } else {
	      scope.root = null;
	      update(scope, [], []);
	    }
	  }

	  function update(scope, nodes, links) {
	    // Compute the new tree layout.
	    if (scope.root) {
	      scope.tree(scope.root);
	    }

	    // Update the nodes…
	    var node = scope.innerG.selectAll('g.node').data(nodes);

	    // Enter any new nodes at the parent's previous position.
	    var nodeEnter = node.enter().append('g').attr('class', 'node').attr('transform', function (d) {
	      return (0, _tree_utils.translate)(d.y, d.x);
	    });

	    nodeEnter.append('circle').attr('r', 4.5);

	    nodeEnter.append('text').attr('dx', 0).attr('dy', '-12px').attr('text-anchor', 'middle').text(function (d) {
	      return (0, _compact_hash2.default)(d.data.name);
	    });

	    nodeEnter.on('mouseover', function go(d) {
	      d3.select(this).select('text').text(d.data.name);
	    }).on('mouseout', function go(d) {
	      d3.select(this).select('text').text((0, _compact_hash2.default)(d.data.name));
	    });

	    // Transition exiting nodes to the parent's new position.
	    var nodeExit = node.exit().transition(scope.transition);

	    nodeExit.remove();

	    // Update the links...
	    var link = scope.innerG.selectAll('path.link').data(links);

	    // Enter any new links at the parent's previous position.
	    link.enter().insert('path', 'g').attr('class', 'link').attr('id', function (d) {
	      return d.target.id;
	    }).attr('d', function (d) {
	      return (0, _tree_utils.makeLink)({ x: d.source.y, y: d.source.x }, { x: d.target.y, y: d.target.x });
	    });

	    // Transition exiting nodes to the parent's new position.
	    link.exit().remove();
	  }

	  return {
	    restrict: 'E',
	    scope: {
	      merklePath: '='
	    },
	    template: '<svg></svg>',
	    link: function link(scope, element) {
	      scope.root = null;
	      scope.tree = d3.tree().size([width, height]);
	      scope.transition = d3.transition().duration(100).ease(d3.easeLinear);

	      scope.svg = d3.select(element.find('svg')[0]).attr('width', width + margin.right + margin.left).attr('height', height + margin.top + margin.bottom);

	      scope.innerG = scope.svg.append('g').attr('transform', function () {
	        return (0, _tree_utils.translate)(margin.top, margin.left);
	      });

	      scope.$watch('merklePath', function () {
	        return display(scope.merklePath, scope);
	      });
	    }
	  };
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.makeLink = makeLink;
	exports.finalLink = finalLink;
	exports.translate = translate;
	exports.stashPositions = stashPositions;
	function makeLink(source, target) {
	  var finalTarget = target || source;
	  return "M" + source.y + "," + source.x + "\n    C" + (source.y + finalTarget.y) / 2 + "," + source.x + " " + (source.y + finalTarget.y) / 2 + ",\n    " + finalTarget.x + " " + finalTarget.y + "," + finalTarget.x;
	}

	function finalLink(d) {
	  return makeLink(d.source, d.target);
	}

	function translate(x, y) {
	  return "translate(" + y + ", " + x + ")";
	}

	function stashPositions(nodes) {
	  // Stash the old positions for transition.
	  nodes.forEach(function (d) {
	    d.x0 = d.x;
	    d.y0 = d.y;
	  });
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (hash) {
	  return hash.slice(0, 3) + "..." + hash.slice(hash.length - 3);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stMapExplorer;

	var _tree_utils = __webpack_require__(2);

	var _compact_hash = __webpack_require__(3);

	var _compact_hash2 = _interopRequireDefault(_compact_hash);

	var _mapexplorer = __webpack_require__(5);

	var _mapexplorer2 = _interopRequireDefault(_mapexplorer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	stMapExplorer.$inject = ['$q', 'debounce']; /**
	                                             @toc
	                                            
	                                             @param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) -
	                                             they can't just be defined in the partial html).
	                                             REMEMBER: use snake-case when setting these on the partial!
	                                             TODO
	                                            
	                                             @param {Object} attrs REMEMBER: use snake-case when setting these on the partial!
	                                             i.e. my-attr='1' NOT myAttr='1'
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

	function stMapExplorer($q, debounce) {
	  var margin = { top: 20, right: 120, bottom: 20, left: 120 };
	  var height = 800 - margin.top - margin.bottom;

	  var defaultOptions = {
	    withArgs: false,
	    getSegmentText: function getSegmentText(node) {
	      return (0, _compact_hash2.default)(node.data.meta.linkHash);
	    },
	    getLinkText: function getLinkText(node) {
	      return node.target.data.link.meta.action + (this.withArgs ? '(' + node.target.data.link.meta.arguments.join(', ') + ')' : '');
	    },

	    duration: 750
	  };

	  function load(scope) {
	    return StratumnSDK.getApplication(scope.application).then(function (app) {
	      return app.getMap(scope.mapId);
	    }).then(function (res) {
	      return $q.all(res.map(function (link) {
	        return link.load();
	      }));
	    }).catch(function (res) {
	      return console.log(res);
	    });
	  }

	  function parse(chainMap) {
	    return d3.stratify().id(function (d) {
	      return d.meta.linkHash;
	    }).parentId(function (d) {
	      return d.link.meta.prevLinkHash;
	    })(chainMap);
	  }

	  function display(chainMap, scope) {
	    if (chainMap && chainMap.length > 0) {
	      scope.root = parse(chainMap);
	      scope.root.x0 = height / 2;
	      scope.root.y0 = 0;
	      update(scope, scope.root.descendants(), scope.root.links());
	    } else {
	      scope.root = null;
	      update(scope, [], []);
	    }
	  }

	  function update(scope, nodes, links) {
	    var maxDepth = d3.max(nodes, function (x) {
	      return x.depth;
	    }) || 0;
	    var computedWidth = Math.max(maxDepth * 100, 500);

	    scope.tree.size([height, computedWidth]);
	    scope.svg.attr('width', computedWidth + margin.right + margin.left).attr('height', height + margin.top + margin.bottom);

	    // Compute the new tree layout.
	    if (scope.root) {
	      scope.tree(scope.root);
	    }

	    // Update the nodes…
	    var node = scope.innerG.selectAll('g.node').data(nodes);

	    // Enter any new nodes at the parent's previous position.
	    var nodeEnter = node.enter().append('g').attr('class', function (d) {
	      return ['node'].concat(d.data.link.meta.tags).join(' ');
	    }).attr('transform', function (d) {
	      var origin = d.parent && d.parent.x0 ? d.parent : scope.root;
	      return (0, _tree_utils.translate)(origin.x0, origin.y0);
	    }).on('mouseover', function (d) {
	      scope.me.show(d.data, d3.event);
	      scope.$apply();
	    });

	    nodeEnter.append('polygon').attr('points', '0,20 30,35 60,20 60,-20 30,-35 0,-20');

	    nodeEnter.append('text').attr('dx', '10px').attr('dy', 0).attr('text-anchor', 'begin').text(scope.options.getSegmentText).style('fill-opacity', 1e-6);

	    // Transition nodes to their new position.
	    var nodeUpdate = scope.svg.selectAll('g.node').transition(scope.transition);

	    nodeUpdate.attr('transform', function (d) {
	      return (0, _tree_utils.translate)(d.x, d.y);
	    });

	    nodeUpdate.select('text').style('fill-opacity', 1);

	    // Transition exiting nodes to the parent's new position.
	    var nodeExit = node.exit().transition(scope.transition);

	    nodeExit.attr('transform', function () {
	      return (0, _tree_utils.translate)(0, 0);
	    }).remove();

	    nodeExit.select('text').style('fill-opacity', 1e-6);

	    // Update the links...
	    var link = scope.innerG.selectAll('path.link').data(links);

	    link.enter().insert('text').attr('dx', '4.5em').attr('dy', '-0.3em').append('textPath').attr('class', 'textpath').attr('xlink:href', function (d) {
	      return '#' + d.target.id;
	    }).text(scope.options.getLinkText);

	    // Enter any new links at the parent's previous position.
	    link.enter().insert('path', 'g').attr('class', 'link').attr('id', function (d) {
	      return d.target.id;
	    }).attr('d', function (d) {
	      var o = d.source && d.source.x0 ? { x: d.source.x0, y: d.source.y0 } : { x: scope.root.x0, y: scope.root.y0 };
	      return (0, _tree_utils.makeLink)(o);
	    });

	    var linkUpdate = scope.innerG.selectAll('path.link').transition(scope.transition);

	    // Transition links to their new position.
	    linkUpdate.attr('d', _tree_utils.finalLink);

	    // Transition exiting nodes to the parent's new position.
	    link.exit().transition(scope.transition).attr('d', function () {
	      return (0, _tree_utils.makeLink)({ x: 0, y: 0 });
	    }).remove();

	    (0, _tree_utils.stashPositions)(nodes);
	  }

	  return {
	    restrict: 'E',
	    scope: {
	      application: '=?',
	      mapId: '=?',
	      chainscript: '=?',
	      refresh: '=',
	      options: '=?'
	    },
	    template: '<svg></svg>',
	    controller: _mapexplorer2.default,
	    controllerAs: 'me',
	    link: function link(scope, element) {
	      scope.options = angular.isDefined(scope.options) ? scope.options : {};
	      scope.options = Object.assign({}, defaultOptions, scope.options);
	      scope.root = null;
	      scope.tree = d3.tree();
	      scope.transition = d3.transition().duration(scope.options.duration).ease(d3.easeLinear);

	      scope.svg = d3.select(element.find('svg')[0]);

	      scope.innerG = scope.svg.append('g').attr('transform', function () {
	        return (0, _tree_utils.translate)(margin.top, margin.left);
	      });

	      var fn = debounce(100, function () {
	        if (scope.mapId && scope.application) {
	          load(scope).then(function (chainMap) {
	            return display(chainMap, scope);
	          });
	        } else if (scope.chainscript && scope.chainscript.length) {
	          try {
	            display(JSON.parse(scope.chainscript), scope);
	          } catch (e) {
	            console.log(e);
	          }
	        }
	      }, true);

	      scope.$watchGroup(['application', 'mapId', 'refresh', 'chainscript'], fn);
	    }
	  };
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SegmentController = function () {
	  function SegmentController($mdDialog) {
	    _classCallCheck(this, SegmentController);

	    this.$mdDialog = $mdDialog;
	  }

	  _createClass(SegmentController, [{
	    key: 'hide',
	    value: function hide() {
	      this.$mdDialog.hide();
	    }
	  }]);

	  return SegmentController;
	}();

	SegmentController.$inject = ['$mdDialog'];

	var MapExplorer = function () {
	  function MapExplorer($mdDialog) {
	    _classCallCheck(this, MapExplorer);

	    this.$mdDialog = $mdDialog;
	  }

	  _createClass(MapExplorer, [{
	    key: 'show',
	    value: function show(segment, event) {
	      this.event = event;
	      this.$mdDialog.show({
	        controller: SegmentController,
	        controllerAs: 'me',
	        templateUrl: 'mapexplorer.html',
	        parent: angular.element(document.body),
	        targetEvent: event,
	        hasBackdrop: false,
	        locals: {
	          segment: segment
	        },
	        bindToController: true,
	        clickOutsideToClose: true
	      });
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.segment = null;
	    }
	  }]);

	  return MapExplorer;
	}();

	exports.default = MapExplorer;


	MapExplorer.$inject = ['$mdDialog'];

/***/ }
/******/ ]);