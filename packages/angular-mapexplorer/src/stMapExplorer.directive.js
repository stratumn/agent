/**
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

import MapExplorer from './MapExplorer.controller';
import { ChainTreeBuilder } from 'mapexplorer-core';

stMapExplorer.$inject = ['$q'];

export default function stMapExplorer($q) {

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
    controller: MapExplorer,
    controllerAs: 'me',
    link: (scope, element, attrs, controller) => {
      scope.tags = [];
      const options = angular.isDefined(scope.options) ? scope.options : {};
      options.onclick = (d, onHide) => {
        controller.show(d.data, onHide);
        scope.$apply();
      };
      options.onTag = tag => {
        if (tag) {
          scope.tags = Array.from(new Set(scope.tags.concat(tag)));
        }
      };
      options.zoomable = true;
      const builder = new ChainTreeBuilder(element, options);

      scope.$watchGroup(['application', 'mapId', 'refresh', 'chainscript'], () => {
        controller.error = null;
        $q.when(builder.build({
          id: scope.mapId,
          application: scope.application,
          chainscript: scope.chainscript
        })).catch(error => (controller.error = error.message));
      });
    }
  };
}
