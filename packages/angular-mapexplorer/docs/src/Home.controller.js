export default class HomeController {
  constructor($scope, $routeParams, AceConfigurationService) {
    this.$scope = $scope;
    this.mapId = $routeParams.mapId;
    this.agentUrl = $routeParams.agentUrl;
    this.process = $routeParams.process;
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
    this.counter += 1;
  }

  generateMap() {
    this.agentUrl = this.agentUrlInput;
    this.mapId = this.mapIdInput;
    this.process = this.processInput;
  }

  edit() {
    this.agentUrlInput = this.agentUrl;
    this.agentUrl = null;
    this.mapIdInput = this.mapId;
    this.mapId = null;
    this.processInput = this.process;
    this.process = null;
  }

  format() {
    const val = this.editor.session.getValue();
    const o = JSON.parse(val);
    this.editor.setValue(JSON.stringify(o, undefined, 2));
  }
}

HomeController.$inject = ['$scope', '$routeParams', 'AceConfigurationService'];
