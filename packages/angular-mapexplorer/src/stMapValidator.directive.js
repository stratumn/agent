stMapValidator.$inject = ['$q', 'debounce'];

export default function stMapValidator($q, debounce) {

  return {
    restrict: 'E',
    scope: {
      chainscript: '=?'
    },
    templateUrl: 'views/mapvalidator.html',
    link: (scope) => {
      const fn = debounce(() => {
        scope.error = null;
        if (angular.isDefined(scope.chainscript)) {
          scope.loading = true;
          $q.when(
            new MapexplorerCore.ChainValidator(scope.chainscript).validate()
          ).then(errors => {
            scope.errors = errors;
            scope.loading = false;
          }).catch(error => {
            scope.error = error.message;
            scope.loading = false;
          });
        }
      }, 100);

      scope.$watch('chainscript', fn);
    }
  };
}
