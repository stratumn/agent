import { ChainValidator } from 'mapexplorer-core';

stMapValidator.$inject = ['$q'];

export default function stMapValidator($q) {

  return {
    restrict: 'E',
    scope: {
      chainscript: '=?'
    },
    templateUrl: 'views/mapvalidator.html',
    link: (scope) => {
      scope.$watch('chainscript', () => {
        scope.error = null;
        if (angular.isDefined(scope.chainscript)) {
          scope.loading = true;
          $q.when(
            new ChainValidator(scope.chainscript).validate()
          ).then(errors => {
            scope.errors = errors;
            scope.loading = false;
          }).catch(error => {
            scope.error = error.message;
            scope.loading = false;
          });
        }
      });
    }
  };
}
