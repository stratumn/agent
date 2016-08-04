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
      scope.options = angular.isDefined(scope.options) ? scope.options : {};
      scope.options.onclick = (d, onHide) => {
        controller.show(d.data, onHide);
        scope.$apply();
      };
      scope.options.onTag = tag => {
        if (tag) {
          scope.tags = Array.from(new Set(scope.tags.concat(tag)));
        }
      };
      const elem = angular.element(element[0].querySelector('.scroll'));
      const builder = ChainTreeBuilderService.getBuilder(elem, scope.options);

      scope.$watchGroup(['application', 'mapId', 'refresh', 'chainscript'], () => {
        controller.error = null;
        controller.loading = true;
        ChainTreeBuilderService.build(builder, scope)
          .then(() => (controller.loading = false))
          .catch(error => {
            controller.loading = false;
            controller.error = error.message;
          });
      });
    }
  };
}
