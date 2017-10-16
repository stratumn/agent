export default class HomeController {
  constructor($scope, $routeParams, AceConfigurationService) {
    this.$scope = $scope;
    this.mapId = $routeParams.mapId;
    this.agentUrl = $routeParams.agentUrl;
    this.process = $routeParams.process;
    this.counter = 0;

    const segmentShowed = {};
    this.segmentShowed = segmentShowed;

    this.mapExplorerFromCSOptions = {
      onSegmentShow() {
        segmentShowed.CS = true;
      },

      onSegmentHide() {
        segmentShowed.CS = false;
      }
    };

    this.mapExplorerFromURLOptions = {
      onSegmentShow() {
        segmentShowed.URL = true;
      },

      onSegmentHide() {
        segmentShowed.URL = false;
      }
    };

    this.aceLoaded = editor => {
      this.editor = editor;
      AceConfigurationService.configure(this.editor);
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
