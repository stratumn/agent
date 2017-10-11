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

export default function stPromiseLoader($q) {
  return {
    restrict: 'E',
    scope: {
      errors: '=',
      loading: '=',
      title: '='
    },
    templateUrl: '../views/promiseloader.html',
    link: scope => {
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
          $q
            .all(scope.errors)
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

stPromiseLoader.$inject = ['$q'];
