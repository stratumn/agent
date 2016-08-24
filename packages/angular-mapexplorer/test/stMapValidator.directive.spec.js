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
