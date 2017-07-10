import chainscript from './fixtures/chainscript.json';

describe('st-map-explorer', () => {
  let element;
  let scope;
  let $compile;
  let ChainTreeBuilderService;

  beforeEach(module('stratumn.angular-mapexplorer'));

  beforeEach(inject((_$rootScope_, _$compile_, _ChainTreeBuilderService_) => {
    const $rootScope = _$rootScope_;
    $compile = _$compile_;
    ChainTreeBuilderService = _ChainTreeBuilderService_;

    scope = $rootScope.$new();

    compileElement(
      '<st-map-explorer application="application" mapId="mapId" chainscript="chainscript" />'
    );
  }));

  const compileElement = (content) => {
    element = angular.element(content);
    $compile(element)(scope);
  };

  describe('with a chainscript', () => {

    it('should build a map explorer', () => {
      spyOn(ChainTreeBuilderService, 'build').and.returnValue(Promise.resolve());

      scope.chainscript = chainscript;
      scope.$apply();
      expect(ChainTreeBuilderService.build).toHaveBeenCalledWith(
         jasmine.any(Object), jasmine.objectContaining({ chainscript }), jasmine.any(Object));
    });

    it('should display the selected segment', () => {
      scope.$digest();
      const controller = element.controller('stMapExplorer');

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
