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

export default class MapExplorer {
  constructor($scope, AceConfigurationService) {
    this.$scope = $scope;
    this.displayed = 'state';
    this.editors = [];

    $scope.$watch(
      () => this.segment,
      () => {
        if (this.segment) {
          this.state = JSON.stringify(this.segment.link.state, undefined, 2);
          this.segmentJSON = JSON.stringify(this.segment, undefined, 2);
        }
      }
    );

    this.aceLoaded = _editor => {
      this.editors.push(_editor);
      AceConfigurationService.configure(_editor);
    };
  }

  show(segment, onHide) {
    this.segment = segment;
    this.onHide = onHide;
    if (this.$scope.options.onSegmentShow) {
      this.$scope.options.onSegmentShow(segment);
    }
  }

  display(tab) {
    this.displayed = tab;

    this.editors.forEach(editor => {
      editor.resize();
      editor.renderer.updateFull();
    });
  }

  close() {
    this.segment = null;
    if (this.$scope.options.onSegmentHide) {
      this.$scope.options.onSegmentHide();
    }
    this.onHide();
  }
}

MapExplorer.$inject = ['$scope', 'AceConfigurationService'];
