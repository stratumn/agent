stPromiseLoader.$inject = ['$q'];

export default function stPromiseLoader($q) {

  return {
    restrict: 'E',
    scope: {
      errors: '=',
      loading: '=',
      title: '='
    },
    templateUrl: 'views/promiseloader.html',
    link: (scope) => {
      scope.errorMessages = [];
      scope.loadingErrors = false;
      scope.success = false;
      scope.error = false;
      scope.toggleErrors = () => {
        scope.errorsShowed = !scope.errorsShowed;
      };
      scope.$watch('errors', () => {
        scope.errorMessages = [];
        scope.success = false;
        scope.error = false;
        if (scope.errors) {
          scope.loadingErrors = true;
          $q.all(scope.errors)
            .then(errs => {
              scope.errorMessages = errs.filter(Boolean);
              scope.loadingErrors = false;
              scope.success = scope.errorMessages.length === 0;
              scope.error = !scope.success;
            })
            .catch(err => {
              console.log(err);
              scope.loadingErrors = false;
            });
        }
      });
    }
  };
}

