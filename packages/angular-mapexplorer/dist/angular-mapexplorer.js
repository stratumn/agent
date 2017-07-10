(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('angular'), require('mapexplorer-core')) :
  typeof define === 'function' && define.amd ? define(['angular', 'mapexplorer-core'], factory) :
  (global.angularMapexplorer = factory(global.angular,global.mapexplorerCore));
}(this, (function (angular,mapexplorerCore) { 'use strict';

angular = 'default' in angular ? angular['default'] : angular;

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

function stMerklePathTree() {
  return {
    restrict: 'E',
    scope: {
      merklePath: '='
    },
    template: '<svg></svg>',
    link: function link(scope, element) {
      var merklePathTree = new mapexplorerCore.MerklePathTree(element);
      scope.$watch('merklePath', function () {
        return merklePathTree.display(scope.merklePath);
      });
    }
  };
}

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

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

stMapExplorer.$inject = ['ChainTreeBuilderService'];

function stMapExplorer(ChainTreeBuilderService) {

  return {
    restrict: 'E',
    scope: {
      applicationUrl: '=?',
      mapId: '=?',
      chainscript: '=?',
      refresh: '=',
      options: '=?',
      name: '=?'
    },
    template: '<span class="error" ng-show="me.error">{{me.error}}</span>\n<div class="segment-container" ng-show="me.segment" flex>\n  <div class="title" layout="row">\n    <div class="header">\n      <h1>Segment</h1>\n      <h2>{{me.segment.meta.linkHash}}</h2>\n    </div>\n    <span flex></span>\n    <md-button class="md-icon-button" aria-label="Close" ng-click="me.close()">\n      <md-icon md-font-library="material-icons">close</md-icon>\n    </md-button>\n  </div>\n  <div layout="row" class="body">\n    <div class="menu">\n      <ul>\n        <li ng-class="{ active: me.displayed == \'state\'}" ng-click="me.display(\'state\')">State</li>\n        <li ng-class="{ active: me.displayed == \'link\' }" ng-click="me.display(\'link\')">Link</li>\n        <li ng-class="{ active: me.displayed == \'evidence\' }" ng-click="me.display(\'evidence\')">Evidence</li>\n        <li ng-class="{ active: me.displayed == \'json\' }" ng-click="me.display(\'json\')">JSON</li>\n      </ul>\n    </div>\n    <div class="content" flex="grow">\n      <div ng-show="me.displayed == \'state\'" flex="grow">\n        <div ui-ace="{\n                            useWrapMode: true,\n                            onLoad: me.aceLoaded\n                        }" ng-model="me.state" readonly></div>\n      </div>\n      <div ng-show="me.displayed == \'link\'" class="link">\n        <h4>Map ID</h4>\n        <p>{{me.segment.link.meta.mapId}}</p>\n\n        <h4>Agent Hash</h4>\n        <p>{{me.segment.link.meta.agentHash}}</p>\n\n        <h4>State Hash</h4>\n        <p>{{me.segment.link.meta.stateHash}}</p>\n\n        <h4>Previous Link hash</h4>\n        <p>{{me.segment.link.meta.prevLinkHash}}</p>\n\n        <h4>Action</h4>\n        <p>{{me.segment.link.meta.action}}({{me.segment.link.meta.arguments | functionArguments}})</p>\n      </div>\n      <div ng-show="me.displayed == \'evidence\'" layout-gt-sm="row" layout="column">\n        <div class="info">\n          <h4>State</h4>\n          <p>{{me.segment.meta.evidence.state}}</p>\n          <div ng-show="me.segment.meta.evidence.state === \'COMPLETE\'">\n            <h4>Bitcoin Transaction</h4>\n            <p>\n              {{me.segment.meta.evidence.transactions[\'bitcoin:main\']}}\n              <a target="_blank" ng-href="https://blockchain.info/tx/{{me.segment.meta.evidence.transactions[\'bitcoin:main\']}}">View transaction on Blockchain.info</a>\n            </p>\n\n            <h4>Merkle root</h4>\n            <p>{{me.segment.meta.evidence.merkleRoot}}</p>\n          </div>\n        </div>\n        <div class="merkle-path" ng-show="me.segment.meta.evidence.state === \'COMPLETE\'">\n          <h4>Merkle Path</h4>\n          <st-merkle-path-tree merkle-path="me.segment.meta.evidence.merklePath"></st-merkle-path-tree>\n        </div>\n      </div>\n      <div ng-show="me.displayed == \'json\'">\n        <div ui-ace="{\n                            useWrapMode: true,\n                            onLoad: me.aceLoaded\n                        }" ng-model="me.segmentJSON" readonly></div>\n      </div>\n    </div>\n  </div>\n</div>\n<div ng-show="me.loading" layout="row" layout-sm="column" layout-align="space-around">\n    <md-progress-circular md-mode="indeterminate" md-diameter="80"></md-progress-circular>\n</div>\n<div ng-hide="me.loading" class="scroll">\n    <div ng-show="tags && tags.length && options.showTagColorConfiguration" draggable id="tags-configuration">\n      <md-toolbar>\n        <div class="md-toolbar-tools">\n          <h4>Configure link tag color</h4>\n          <md-button class="md-icon-button" aria-label="Close" ng-click="options.showTagColorConfiguration = false">\n            <md-icon md-font-library="material-icons">close</md-icon>\n          </md-button>\n        </div>\n      </md-toolbar>\n      <div class="content">\n        <st-tag-color-picker ng-repeat="tag in tags" tag="tag"></st-tag-color-picker>\n      </div>\n    </div>\n</div>\n',
    controller: 'MapExplorerController',
    controllerAs: 'me',
    link: function link(scope, element, attrs, controller) {
      var defaultOptions = {
        onclick: function onclick(d, onHide) {
          controller.show(d.data, onHide);
          scope.$apply();
        },
        onTag: function onTag(tag) {
          if (tag) {
            scope.tags = Array.from(new Set(scope.tags.concat(tag)));
          }
        }
      };

      scope.tags = [];
      var elem = angular.element(element[0].querySelector('.scroll'))[0];
      var builder = ChainTreeBuilderService.getBuilder(elem);

      var update = function update() {
        var options = _extends({}, defaultOptions, scope.options);

        controller.error = null;
        controller.loading = true;
        ChainTreeBuilderService.build(builder, scope, options).then(function () {
          return controller.loading = false;
        }).catch(function (error) {
          controller.loading = false;
          controller.error = error.message;
        });
      };

      scope.$watchGroup(['applicationUrl', 'mapId', 'refresh', 'chainscript'], update);
      scope.$watch('options', update, true);
    }
  };
}

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

stMapValidator.$inject = ['MapValidatorService'];

function stMapValidator(MapValidatorService) {

  return {
    restrict: 'E',
    scope: {
      chainscript: '=?'
    },
    template: '<h2>Validations</h2>\n<ul>\n    <st-promise-loader title=" \'Link Hashes\' " loading="loading" errors="errors.linkHash"></st-promise-loader>\n    <st-promise-loader title=" \'State Hashes\' " loading="loading" errors="errors.stateHash"></st-promise-loader>\n    <st-promise-loader title=" \'Merkle Path\' " loading="loading" errors="errors.merklePath"></st-promise-loader>\n    <st-promise-loader title=" \'Fossils\' " loading="loading" errors="errors.fossil"></st-promise-loader>\n</ul>\n',
    link: function link(scope) {
      scope.$watch('chainscript', function () {
        scope.error = null;
        if (angular.isDefined(scope.chainscript)) {
          scope.loading = true;
          MapValidatorService.validate(scope.chainscript).then(function (errors) {
            scope.errors = errors;
            scope.loading = false;
          }).catch(function (error) {
            scope.error = error.message;
            scope.loading = false;
          });
        }
      });
    }
  };
}

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

stPromiseLoader.$inject = ['$q'];

function stPromiseLoader($q) {

  return {
    restrict: 'E',
    scope: {
      errors: '=',
      loading: '=',
      title: '='
    },
    template: '<li class="category" ng-class="[{ error: error, success: success }, (loading || loadingErrors) ? \'loading\' : \'\']">\n    <div layout="row">\n        <md-progress-circular ng-show="loading || loadingErrors" md-mode="indeterminate" md-diameter="25"></md-progress-circular>\n        <h3 flex="grow">{{title}}</h3>\n        <span flex="grow"></span>\n        <div class="errorCount" ng-show="error && !(loading || loadingErrors)" ng-click="toggleErrors()" flex="grow">\n            <ng-pluralize count="errorMessages.length"\n                          when="{\'0\': \'No errors\',\n                         \'one\': \'1 error\',\n                         \'other\': \'{} errors\'}">\n            </ng-pluralize>\n        </div>\n    </div>\n    <div ng-show="errorsShowed" class="errors">\n        <ul>\n            <li ng-repeat="err in errorMessages">{{ err }}</li>\n        </ul>\n    </div>\n</li>\n',
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

function stTagColorPicker() {

  function setTagStyle(scope) {
    scope.tagStyle = '.' + scope.tag + ' polygon { stroke: ' + scope.color + '; stroke-width: 5px; }' + ('.' + scope.tag + ' rect { stroke-dasharray: 0,78,25,78,25; ') + ('stroke: ' + scope.color + '; stroke-width: 5px}');
  }

  return {
    restrict: 'E',
    scope: {
      tag: '='
    },
    template: '<style ng-bind-html="tagStyle"></style>\n<div layout="row">\n    <md-color-picker ng-model="color" md-color-clear-button="false"></md-color-picker>\n    <span>{{tag}}</span>\n</div>\n',
    link: function link(scope) {
      scope.color = hashStringToColor(scope.tag);

      setTagStyle(scope);

      scope.$watch('color', function () {
        setTagStyle(scope);
      });
    }
  };
}

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

var AceConfigurationService = function () {
  function AceConfigurationService() {
    classCallCheck(this, AceConfigurationService);
  }

  createClass(AceConfigurationService, [{
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

var ChainTreeBuilderService = function () {
  function ChainTreeBuilderService($q) {
    classCallCheck(this, ChainTreeBuilderService);

    this.$q = $q;
  }

  createClass(ChainTreeBuilderService, [{
    key: 'getBuilder',
    value: function getBuilder(element) {
      return new mapexplorerCore.ChainTreeBuilder(element);
    }
  }, {
    key: 'build',
    value: function build(builder, map, options) {
      return this.$q.when(builder.build({
        id: map.mapId,
        applicationUrl: map.applicationUrl,
        chainscript: map.chainscript
      }, options));
    }
  }]);
  return ChainTreeBuilderService;
}();

ChainTreeBuilderService.$inject = ['$q'];

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

var MapValidatorService = function () {
  function MapValidatorService($q) {
    classCallCheck(this, MapValidatorService);

    this.$q = $q;
  }

  createClass(MapValidatorService, [{
    key: 'validate',
    value: function validate(chainscript) {
      return this.$q.when(new mapexplorerCore.ChainValidator(chainscript).validate());
    }
  }]);
  return MapValidatorService;
}();

MapValidatorService.$inject = ['$q'];

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

var MapExplorer = function () {
  function MapExplorer($scope, AceConfigurationService) {
    var _this = this;

    classCallCheck(this, MapExplorer);

    this.$scope = $scope;
    this.displayed = 'state';
    this.editors = [];

    $scope.$watch(function () {
      return _this.segment;
    }, function () {
      if (_this.segment) {
        _this.state = JSON.stringify(_this.segment.link.state, undefined, 2);
        _this.segmentJSON = JSON.stringify(_this.segment, undefined, 2);
      }
    });

    this.aceLoaded = function (_editor) {
      _this.editors.push(_editor);
      AceConfigurationService.configure(_editor);
    };
  }

  createClass(MapExplorer, [{
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

      this.editors.forEach(function (editor) {
        editor.resize();
        editor.renderer.updateFull();
      });
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

MapExplorer.$inject = ['$scope', 'AceConfigurationService'];

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

function filter() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return args.map(function (arg) {
    if (arg instanceof Object) {
      return JSON.stringify(arg, undefined, 2);
    }
    return arg;
  }).join(', ');
}

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

var index = angular.module('stratumn.angular-mapexplorer', ['ngAnimate', 'material.components.autocomplete', 'material.components.button', 'material.components.icon', 'material.components.toolbar', 'ngSanitize', 'material.components.progressCircular', 'ngAria', 'mdColorPicker', 'ui.drop', 'ui.ace']).directive('stMapExplorer', stMapExplorer).directive('stMerklePathTree', stMerklePathTree).directive('stMapValidator', stMapValidator).directive('stPromiseLoader', stPromiseLoader).directive('stTagColorPicker', stTagColorPicker).service('AceConfigurationService', AceConfigurationService).service('ChainTreeBuilderService', ChainTreeBuilderService).service('MapValidatorService', MapValidatorService).controller('MapExplorerController', MapExplorer).filter('functionArguments', function () {
  return filter;
}).name;

return index;

})));
//# sourceMappingURL=angular-mapexplorer.js.map
