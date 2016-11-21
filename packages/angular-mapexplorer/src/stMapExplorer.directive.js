import angular from 'angular';

stMapExplorer.$inject = ['ChainTreeBuilderService'];

export default function stMapExplorer(ChainTreeBuilderService) {

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
          .then(() => (controller.loading = false))
          .catch(error => {
            controller.loading = false;
            controller.error = error.message;
          });
      };

      scope.$watchGroup(['applicationUrl', 'mapId', 'refresh', 'chainscript'], update);
      scope.$watch('options', update, true);
    }
  };
}
