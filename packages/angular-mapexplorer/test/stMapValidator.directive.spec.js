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

import chainscript from './fixtures/chainscript.json';

describe('st-map-validator', () => {

  let element;
  let scope;
  let compile;
  let MapValidatorService;

  beforeEach(angular.mock.module('stratumn.angular-mapexplorer'));

  beforeEach(inject((_$rootScope_,_$compile_, _MapValidatorService_) => {
    const $rootScope = _$rootScope_;
    compile = _$compile_;
    MapValidatorService = _MapValidatorService_;

    scope = $rootScope.$new();

    compileElement(
      '<st-map-validator chainscript="chainscript">' +
      '</st-map-validator>'
    );
  }));

  const compileElement = (content) => {
    element = angular.element(content);
    compile(element)(scope);
  };

  describe('with a chainscript', () => {

    it('should build a map explorer', () => {
      spyOn(MapValidatorService, 'validate').and.returnValue(Promise.resolve());

      scope.chainscript = chainscript;
      scope.$apply();

      expect(MapValidatorService.validate).toHaveBeenCalledWith(chainscript);
    });
  });

});
