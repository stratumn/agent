export default class HomeController {

  constructor($scope, $routeParams, AceConfigurationService) {
    this.$scope = $scope;
    this.mapId = $routeParams.mapId;
    this.application = $routeParams.application;
    this.counter = 0;
    this.segmentShowed = {};

    this.aceLoaded = editor => {
      this.editor = editor;
      AceConfigurationService.configure(this.editor);
    };

    this.$scope.onSegmentShow = name => {
      this.segmentShowed[name] = true;
    };

    this.$scope.onSegmentHide = name => {
      this.segmentShowed[name] = false;
    };
  }

  refresh() {
    this.counter++;
  }

  generateMap() {
    this.application = this.applicationInput;
    this.mapId = this.mapIdInput;
  }

  edit() {
    this.applicationInput = this.application;
    this.application =  null;
    this.mapIdInput = this.mapId;
    this.mapId = null;
  }

  format() {
    const val = this.editor.session.getValue();
    const o = JSON.parse(val);
    this.editor.setValue(JSON.stringify(o, undefined, 2));
  }
}

HomeController.$inject = ['$scope', '$routeParams', 'AceConfigurationService'];
