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

	__webpack_require__(1);
	module.exports = __webpack_require__(10);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stMerklePathTree = __webpack_require__(2);

	var _stMerklePathTree2 = _interopRequireDefault(_stMerklePathTree);

	var _stMapExplorer = __webpack_require__(3);

	var _stMapExplorer2 = _interopRequireDefault(_stMapExplorer);

	var _stMapValidator = __webpack_require__(5);

	var _stMapValidator2 = _interopRequireDefault(_stMapValidator);

	var _stPromiseLoader = __webpack_require__(6);

	var _stPromiseLoader2 = _interopRequireDefault(_stPromiseLoader);

	var _stTagColorPicker = __webpack_require__(7);

	var _stTagColorPicker2 = _interopRequireDefault(_stTagColorPicker);

	var _AceConfiguration = __webpack_require__(9);

	var _AceConfiguration2 = _interopRequireDefault(_AceConfiguration);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	angular.module('stratumn.angular-mapexplorer', ['mgcrea.jquery', 'mdColorPicker', 'ui.drop']).directive('stMapExplorer', _stMapExplorer2.default).directive('stMerklePathTree', _stMerklePathTree2.default).directive('stMapValidator', _stMapValidator2.default).directive('stPromiseLoader', _stPromiseLoader2.default).directive('stTagColorPicker', _stTagColorPicker2.default).service('AceConfigurationService', _AceConfiguration2.default);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stMerklePathTree;
	function stMerklePathTree() {
	  return {
	    restrict: 'E',
	    scope: {
	      merklePath: '='
	    },
	    template: '<svg></svg>',
	    link: function link(scope, element) {
	      var merklePathTree = new MapexplorerCore.MerklePathTree(element);
	      scope.$watch('merklePath', function () {
	        return merklePathTree.display(scope.merklePath);
	      });
	    }
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stMapExplorer;

	var _MapExplorer = __webpack_require__(4);

	var _MapExplorer2 = _interopRequireDefault(_MapExplorer);

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

	  return {
	    restrict: 'E',
	    scope: {
	      application: '=?',
	      mapId: '=?',
	      chainscript: '=?',
	      refresh: '=',
	      options: '=?',
	      name: '=?'
	    },
	    templateUrl: 'views/mapexplorer.html',
	    controller: _MapExplorer2.default,
	    controllerAs: 'me',
	    link: function link(scope, element, attrs, controller) {
	      scope.tags = [];
	      var options = angular.isDefined(scope.options) ? scope.options : {};
	      options.onclick = function (d, onHide) {
	        controller.show(d.data, onHide);
	        scope.$apply();
	      };
	      options.onTag = function (tag) {
	        if (tag) {
	          scope.tags = Array.from(new Set(scope.tags.concat(tag)));
	        }
	      };
	      options.zoomable = true;
	      var builder = new MapexplorerCore.ChainTreeBuilder(element, options);

	      var fn = debounce(function () {
	        controller.error = null;
	        $q.when(builder.build({
	          id: scope.mapId,
	          application: scope.application,
	          chainscript: scope.chainscript
	        })).catch(function (error) {
	          return controller.error = error.message;
	        });
	      }, 100);

	      scope.$watchGroup(['application', 'mapId', 'refresh', 'chainscript'], fn);
	    }
	  };
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MapExplorer = function () {
	  function MapExplorer($scope, AceConfigurationService) {
	    var _this = this;

	    _classCallCheck(this, MapExplorer);

	    this.$scope = $scope;
	    this.displayed = 'state';

	    $scope.$watch(function () {
	      return _this.segment;
	    }, function () {
	      if (_this.segment) {
	        _this.state = JSON.stringify(_this.segment.link.state, undefined, 2);
	        _this.segmentJSON = JSON.stringify(_this.segment, undefined, 2);
	      }
	    });

	    this.aceLoaded = function (_editor) {
	      AceConfigurationService.configure(_editor);
	    };
	  }

	  _createClass(MapExplorer, [{
	    key: 'show',
	    value: function show(segment, onHide) {
	      this.segment = segment;
	      this.onHide = onHide;
	      this.$scope.$parent.onSegmentShow(this.$scope.name);
	    }
	  }, {
	    key: 'display',
	    value: function display(tab) {
	      this.displayed = tab;
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.segment = null;
	      this.$scope.$parent.onSegmentHide(this.$scope.name);
	      this.onHide();
	    }
	  }]);

	  return MapExplorer;
	}();

	exports.default = MapExplorer;


	MapExplorer.$inject = ['$scope', 'AceConfigurationService'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stMapValidator;
	stMapValidator.$inject = ['$q', 'debounce'];

	function stMapValidator($q, debounce) {

	  return {
	    restrict: 'E',
	    scope: {
	      chainscript: '=?'
	    },
	    templateUrl: 'views/mapvalidator.html',
	    link: function link(scope) {
	      var fn = debounce(function () {
	        scope.error = null;
	        if (angular.isDefined(scope.chainscript)) {
	          scope.loading = true;
	          $q.when(new MapexplorerCore.ChainValidator(scope.chainscript).validate()).then(function (errors) {
	            scope.errors = errors;
	            scope.loading = false;
	          }).catch(function (error) {
	            scope.error = error.message;
	            scope.loading = false;
	          });
	        }
	      }, 100);

	      scope.$watch('chainscript', fn);
	    }
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stPromiseLoader;
	stPromiseLoader.$inject = ['$q'];

	function stPromiseLoader($q) {

	  return {
	    restrict: 'E',
	    scope: {
	      errors: '=',
	      loading: '=',
	      title: '='
	    },
	    templateUrl: 'views/promiseloader.html',
	    link: function link(scope) {
	      scope.errorMessages = [];
	      scope.loadingErrors = false;
	      scope.success = false;
	      scope.error = false;
	      scope.toggleErrors = function () {
	        scope.errorsShowed = !scope.errorsShowed;
	      };
	      scope.$watch('errors', function () {
	        scope.errorMessages = [];
	        scope.success = false;
	        scope.error = false;
	        if (scope.errors) {
	          scope.loadingErrors = true;
	          $q.all(scope.errors).then(function (errs) {
	            scope.errorMessages = errs.filter(Boolean);
	            scope.loadingErrors = false;
	            scope.success = scope.errorMessages.length === 0;
	            scope.error = !scope.success;
	          }).catch(function (err) {
	            console.log(err);
	            scope.loadingErrors = false;
	          });
	        }
	      });
	    }
	  };
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stTagColorPicker;

	var _hashToStringColor = __webpack_require__(8);

	var _hashToStringColor2 = _interopRequireDefault(_hashToStringColor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function stTagColorPicker() {

	  function setTagStyle(scope) {
	    scope.tagStyle = '.' + scope.tag + ' polygon { stroke: ' + scope.color + '; stroke-width: 5px; }' + ('.' + scope.tag + ' rect { stroke-dasharray: 0,78,25,78,25; stroke: ' + scope.color + '; stroke-width: 5px}');
	  }

	  return {
	    restrict: 'E',
	    scope: {
	      tag: '='
	    },
	    templateUrl: 'views/tagcolorpicker.html',
	    link: function link(scope) {
	      scope.color = (0, _hashToStringColor2.default)(scope.tag);

	      setTagStyle(scope);

	      scope.$watch('color', function () {
	        setTagStyle(scope);
	      });
	    }
	  };
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = hashStringToColor;
	function djb2(str) {
	  var hash = 5381;
	  for (var i = 0; i < str.length; i++) {
	    hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
	  }
	  return hash;
	}

	function hashStringToColor(str) {
	  var hash = djb2(str);
	  var r = (hash & 0xFF0000) >> 16;
	  var g = (hash & 0x00FF00) >> 8;
	  var b = hash & 0x0000FF;
	  return "#" + (("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2));
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AceConfigurationService = function () {
	  function AceConfigurationService() {
	    _classCallCheck(this, AceConfigurationService);
	  }

	  _createClass(AceConfigurationService, [{
	    key: 'configure',
	    value: function configure(editor) {
	      editor.setShowPrintMargin(false);
	      editor.$blockScrolling = Infinity;
	      editor.setOptions({
	        fontFamily: 'RationalTWText-Light, \'Roboto Mono\', monospace',
	        fontSize: '14'
	      });
	    }
	  }]);

	  return AceConfigurationService;
	}();

	exports.default = AceConfigurationService;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	angular.module('stratumn.angular-mapexplorer').run(['$templateCache', function ($templateCache) {
	  'use strict';

	  $templateCache.put('views/mapexplorer.html', "<span class=\"error\" ng-show=\"me.error\">{{me.error}}</span>\n" + "<div class=\"segment-container\" ng-show=\"me.segment\" ng-include=\" 'views/segment.html' \" flex></div>\n" + "<div draggable id=\"tags-configuration\">\n" + "    <h4>Configure link tag color</h4>\n" + "    <st-tag-color-picker ng-repeat=\"tag in tags\" tag=\"tag\"></st-tag-color-picker>\n" + "</div>\n" + "<div class=\"scroll\">\n" + "    <svg></svg>\n" + "</div>\n");

	  $templateCache.put('views/mapvalidator.html', "<h2>Validations</h2>\n" + "<ul>\n" + "    <st-promise-loader title=\" 'Link Hashes' \" loading=\"loading\" errors=\"errors.linkHash\"></st-promise-loader>\n" + "    <st-promise-loader title=\" 'State Hashes' \" loading=\"loading\" errors=\"errors.stateHash\"></st-promise-loader>\n" + "    <st-promise-loader title=\" 'Merkle Path' \" loading=\"loading\" errors=\"errors.merklePath\"></st-promise-loader>\n" + "    <st-promise-loader title=\" 'Fossils' \" loading=\"loading\" errors=\"errors.fossil\"></st-promise-loader>\n" + "</ul>\n");

	  $templateCache.put('views/promiseloader.html', "<li class=\"category\" ng-class=\"[{ error: error, success: success }, (loading || loadingErrors) ? 'loading' : '']\">\n" + "    <div layout=\"row\">\n" + "        <md-progress-circular ng-show=\"loading || loadingErrors\" md-mode=\"indeterminate\"></md-progress-circular>\n" + "        <h3 flex-grow>{{title}}</h3>\n" + "        <span flex-grow></span>\n" + "        <div class=\"errorCount\" ng-show=\"error && !(loading || loadingErrors)\" ng-click=\"toggleErrors()\" flex-grow>\n" + "            <ng-pluralize count=\"errorMessages.length\"\n" + "                          when=\"{'0': 'No errors',\n" + "                         'one': '1 error',\n" + "                         'other': '{} errors'}\">\n" + "            </ng-pluralize>\n" + "        </div>\n" + "    </div>\n" + "    <div ng-show=\"errorsShowed\" class=\"errors\">\n" + "        <ul>\n" + "            <li ng-repeat=\"err in errorMessages\">{{ err }}</li>\n" + "        </ul>\n" + "    </div>\n" + "</li>\n");

	  $templateCache.put('views/segment.html', "<div class=\"title\" layout=\"row\">\n" + "    <div class=\"header\">\n" + "        <h1>Segment</h1>\n" + "        <h2>{{me.segment.meta.linkHash}}</h2>\n" + "    </div>\n" + "    <span flex></span>\n" + "    <md-button class=\"md-icon-button\" aria-label=\"Close\" ng-click=\"me.close()\">\n" + "        <md-icon md-font-library=\"material-icons\">close</md-icon>\n" + "    </md-button>\n" + "</div>\n" + "<div layout=\"row\" class=\"body\">\n" + "    <div class=\"menu\">\n" + "        <ul>\n" + "            <li ng-class=\"{ active: me.displayed == 'state'}\" ng-click=\"me.display('state')\">State</li>\n" + "            <li ng-class=\"{ active: me.displayed == 'link' }\" ng-click=\"me.display('link')\">Link</li>\n" + "            <li ng-class=\"{ active: me.displayed == 'evidence' }\" ng-click=\"me.display('evidence')\">Evidence</li>\n" + "            <li ng-class=\"{ active: me.displayed == 'json' }\" ng-click=\"me.display('json')\">JSON</li>\n" + "        </ul>\n" + "    </div>\n" + "    <div class=\"content\" flex-grow>\n" + "        <div ng-show=\"me.displayed == 'state'\" flex-grow>\n" + "            <div ui-ace=\"{\n" + "                            useWrapMode: true,\n" + "                            onLoad: me.aceLoaded\n" + "                        }\" ng-model=\"me.state\" readonly></div>\n" + "        </div>\n" + "        <div ng-show=\"me.displayed == 'link'\" class=\"link\">\n" + "            <h4>Map ID</h4>\n" + "            <p>{{me.segment.link.meta.mapId}}</p>\n" + "\n" + "            <h4>Agent Hash</h4>\n" + "            <p>{{me.segment.link.meta.agentHash}}</p>\n" + "\n" + "            <h4>State Hash</h4>\n" + "            <p>{{me.segment.link.meta.stateHash}}</p>\n" + "\n" + "            <h4>Previous Link hash</h4>\n" + "            <p>{{me.segment.link.meta.prevLinkHash}}</p>\n" + "\n" + "            <h4>Action</h4>\n" + "            <p>{{me.segment.link.meta.action}}({{me.segment.link.meta.arguments.join(', ')}})</p>\n" + "        </div>\n" + "        <div ng-show=\"me.displayed == 'evidence'\" layout-gt-sm=\"row\" layout=\"column\">\n" + "            <div class=\"info\">\n" + "                <h4>State</h4>\n" + "                <p>{{me.segment.meta.evidence.state}}</p>\n" + "                <div ng-show=\"me.segment.meta.evidence.state === 'COMPLETE'\">\n" + "                    <h4>Bitcoin Transaction</h4>\n" + "                    <p>\n" + "                        {{me.segment.meta.evidence.transactions['bitcoin:main']}}\n" + "                        <a target=\"_blank\" ng-href=\"https://blockchain.info/tx/{{me.segment.meta.evidence.transactions['bitcoin:main']}}\">View transaction on Blockchain.info</a>\n" + "                    </p>\n" + "\n" + "                    <h4>Merkle root</h4>\n" + "                    <p>{{me.segment.meta.evidence.merkleRoot}}</p>\n" + "                </div>\n" + "            </div>\n" + "            <div class=\"merkle-path\" ng-show=\"me.segment.meta.evidence.state === 'COMPLETE'\">\n" + "                <h4>Merkle Path</h4>\n" + "                <st-merkle-path-tree merkle-path=\"me.segment.meta.evidence.merklePath\"></st-merkle-path-tree>\n" + "            </div>\n" + "        </div>\n" + "        <div ng-show=\"me.displayed == 'json'\">\n" + "            <div ui-ace=\"{\n" + "                            useWrapMode: true,\n" + "                            onLoad: me.aceLoaded\n" + "                        }\" ng-model=\"me.segmentJSON\" readonly></div>\n" + "        </div>\n" + "    </div>\n" + "</div>\n");

	  $templateCache.put('views/tagcolorpicker.html', "<style ng-bind-html=\"tagStyle\"></style>\n" + "<div layout=\"row\">\n" + "    <md-color-picker ng-model=\"color\" md-color-clear-button=\"false\"></md-color-picker>\n" + "    <span>{{tag}}</span>\n" + "</div>\n");
	}]);

/***/ }
/******/ ]);