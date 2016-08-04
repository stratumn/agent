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
      const elem = angular.element(element[0].querySelector('.scroll'));
      const builder = ChainTreeBuilderService.getBuilder(elem);

      const update = () => {
        const options = { ...defaultOptions, ...scope.options };

        controller.error = null;
        controller.loading = true;
        ChainTreeBuilderService.build(builder, scope, options)
          .then(() => (controller.loading = false))
          .catch(error => {
            controller.loading = false;
            controller.error = error.message;
          });
      };

      scope.$watchGroup(['application', 'mapId', 'refresh', 'chainscript'], update);
      scope.$watch('options', update, true);
    }
  };
}
