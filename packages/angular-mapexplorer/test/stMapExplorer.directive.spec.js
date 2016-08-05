import mapexplorer from '../src/index';

import chainscript from './fixtures/chainscript.json';

describe('st-map-explorer', function () {

  let element;
  let scope;
  let compile;
  let ChainTreeBuilderService;

  beforeEach(angular.mock.module(mapexplorer));

  beforeEach(inject(function(_$rootScope_,_$compile_, _ChainTreeBuilderService_) {
    const $rootScope = _$rootScope_;
    compile = _$compile_;
    ChainTreeBuilderService = _ChainTreeBuilderService_;

    scope = $rootScope.$new();

    compileElement(
      '<st-map-explorer application="application" mapId="mapId" chainscript="chainscript" />'
    );
  }));

  const compileElement = (content) => {
    element = angular.element(content);
    compile(element)(scope);
  };

  describe('with a chainscript', () => {

    it('should build a map explorer', () => {
      spyOn(ChainTreeBuilderService, 'getBuilder');
      spyOn(ChainTreeBuilderService, 'build').and.returnValue(Promise.resolve());

      scope.chainscript = chainscript;
      scope.$apply();

      expect(ChainTreeBuilderService.getBuilder).toHaveBeenCalledWith(
        angular.element(element[0].querySelector('.scroll'))[0]
      );
      expect(ChainTreeBuilderService.build).toHaveBeenCalledWith(
        undefined, jasmine.objectContaining({ chainscript }), jasmine.any(Object));

      ChainTreeBuilderService.getBuilder.calls.reset();
      ChainTreeBuilderService.build.calls.reset();

      scope.chainscript = {};
      scope.$apply();

      expect(ChainTreeBuilderService.getBuilder).not.toHaveBeenCalled();
      expect(ChainTreeBuilderService.build).toHaveBeenCalled();
    });

    it('should display the selected segment', () => {
      scope.$digest();
      const controller = element.controller('stMapExplorer');

      // console.log(element[0].querySelector('.segment-container'));
      expect(
        angular.element(element[0].querySelector('.segment-container')).hasClass('ng-hide')
      ).toBe(true);

      controller.segment = chainscript[0];
      scope.$apply();

      expect(element.text()).toContain(controller.segment.meta.linkHash);
      expect(
        angular.element(element[0].querySelector('.segment-container')).hasClass('ng-hide')
      ).toBe(false);
    });
  });

});
