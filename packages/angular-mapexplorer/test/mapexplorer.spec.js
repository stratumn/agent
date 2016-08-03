import mapexplorer from '../src/index';

import chainscript from './fixtures/chainscript.json';

describe('stratum.angular-mapexplorer', function () {

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
      '<st-map-explorer application="application" mapId="mapId" chainscript="chainscript">' +
      '</st-map-explorer>'
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

      expect(ChainTreeBuilderService.getBuilder).toHaveBeenCalledWith(element, jasmine.any(Object));
      expect(ChainTreeBuilderService.build).toHaveBeenCalledWith(
        undefined, jasmine.objectContaining({ chainscript }));

      ChainTreeBuilderService.getBuilder.calls.reset();
      ChainTreeBuilderService.build.calls.reset();

      scope.chainscript = {};
      scope.$apply();

      expect(ChainTreeBuilderService.getBuilder).not.toHaveBeenCalled();
      expect(ChainTreeBuilderService.build).toHaveBeenCalled();
    });
  });

});
