import angular from 'angular';
import template from '../views/mapexplorer.html';

stMapExplorer.$inject = ['ChainTreeBuilderService'];

export default function stMapExplorer(ChainTreeBuilderService) {

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
    templateUrl: template,
    controller: 'MapExplorerController',
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
      const builder = ChainTreeBuilderService.getBuilder(element, options);

      scope.$watchGroup(['application', 'mapId', 'refresh', 'chainscript'], () => {
        controller.error = null;
        ChainTreeBuilderService.build(builder, scope)
          .catch(error => (controller.error = error.message));
      });
    }
  };
}
