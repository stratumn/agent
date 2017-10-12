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

import angular from 'angular';

export default function stMapExplorer(ChainTreeBuilderService) {
  return {
    restrict: 'E',
    scope: {
      agentUrl: '=?',
      mapId: '=?',
      chainscript: '=?',
      process: '=?',
      refresh: '=',
      options: '=?',
      name: '=?'
    },
    templateUrl: '../views/mapexplorer.html',
    controller: 'MapExplorerController',
    controllerAs: 'me',
    link: (scope, element, attrs, controller) => {
      const defaultOptions = {
        onclick(d, onHide) {
          controller.show(d.data, onHide);
          scope.$apply();
        },
        onTag(tag) {
          if (tag) {
            scope.tags = Array.from(new Set(scope.tags.concat(tag)));
          }
        }
      };

      scope.tags = [];
      const elem = angular.element(element[0].querySelector('.scroll'))[0];
      const builder = ChainTreeBuilderService.getBuilder(elem);

      const update = () => {
        const options = { ...defaultOptions, ...scope.options };

        controller.error = null;
        controller.loading = true;
        ChainTreeBuilderService.build(builder, scope, options)
          .then(() => {
            controller.loading = false;
          })
          .catch(error => {
            controller.loading = false;
            controller.error = error.message;
          });
      };

      scope.$watchGroup(
        ['agentUrl', 'mapId', 'process', 'refresh', 'chainscript'],
        update
      );
      scope.$watch('options', update, true);
    }
  };
}

stMapExplorer.$inject = ['ChainTreeBuilderService'];
