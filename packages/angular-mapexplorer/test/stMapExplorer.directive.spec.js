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
/* global inject, angular, spyOn, expect, jasmine */
import chainscript from './fixtures/chainscript.json';
import '../src/index';

describe('st-map-explorer', () => {
  let element;
  let scope;
  let $compile;
  let ChainTreeBuilderService;

  const compileElement = content => {
    element = angular.element(content);
    $compile(element)(scope);
  };

  beforeEach(module('stratumn.angular-mapexplorer'));

  beforeEach(
    inject((_$rootScope_, _$compile_, _ChainTreeBuilderService_) => {
      const $rootScope = _$rootScope_;
      $compile = _$compile_;
      ChainTreeBuilderService = _ChainTreeBuilderService_;

      scope = $rootScope.$new();

      compileElement(
        '<st-map-explorer application="application" mapId="mapId" chainscript="chainscript" />'
      );
    })
  );

  describe('with a chainscript', () => {
    it('should build a map explorer', () => {
      spyOn(ChainTreeBuilderService, 'build').and.returnValue(
        Promise.resolve()
      );

      scope.chainscript = chainscript;
      scope.$apply();
      expect(ChainTreeBuilderService.build).toHaveBeenCalledWith(
        jasmine.any(Object),
        jasmine.objectContaining({ chainscript }),
        jasmine.any(Object)
      );
    });

    it('should display the selected segment', () => {
      scope.$digest();
      const controller = element.controller('stMapExplorer');

      expect(
        angular
          .element(element[0].querySelector('.segment-container'))
          .hasClass('ng-hide')
      ).toBe(true);

      [controller.segment] = chainscript;
      scope.$apply();

      expect(element.text()).toContain(controller.segment.meta.linkHash);
      expect(
        angular
          .element(element[0].querySelector('.segment-container'))
          .hasClass('ng-hide')
      ).toBe(false);
    });
  });
});
