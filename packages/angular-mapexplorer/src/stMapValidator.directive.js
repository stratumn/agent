/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

export default function stMapValidator(MapValidatorService) {
  return {
    restrict: 'E',
    scope: {
      chainscript: '=?'
    },
    templateUrl: '../views/mapvalidator.html',
    link: scope => {
      scope.$watch('chainscript', () => {
        scope.error = null;
        if (angular.isDefined(scope.chainscript)) {
          scope.loading = true;
          MapValidatorService.validate(scope.chainscript)
            .then(errors => {
              scope.errors = errors;
              scope.loading = false;
            })
            .catch(error => {
              scope.error = error.message;
              scope.loading = false;
            });
        }
      });
    }
  };
}

stMapValidator.$inject = ['MapValidatorService'];
