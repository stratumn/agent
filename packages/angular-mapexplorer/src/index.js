/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

import angular from 'angular';

import '../vendor/angular-drop';
import '../vendor/ace';
import '../vendor/ui-ace';

import stMerklePathTree from './stMerklePathTree.directive';
import stMapExplorer from './stMapExplorer.directive';
import stMapValidator from './stMapValidator.directive';
import stPromiseLoader from './stPromiseLoader.directive';
import stTagColorPicker from './stTagColorPicker.directive';
import stEvidences from './stEvidences.directive';
import stBitcoinEvidence from './stBitcoinEvidence.directive';
import stDummyEvidence from './stDummyEvidence.directive';
import stTmpopEvidence from './stTmpopEvidence.directive';
import AceConfigurationService from './AceConfiguration.service';
import ChainTreeBuilderService from './ChainTreeBuilder.service';
import MapValidatorService from './MapValidator.service';
import MapExplorerController from './MapExplorer.controller';
import functionArguments from './functionArguments.filter';
import signaturesList from './signaturesList.filter';

export default angular
  .module('stratumn.angular-mapexplorer', [
    'ngAnimate',
    'material.components.autocomplete',
    'material.components.button',
    'material.components.icon',
    'material.components.toolbar',
    'ngSanitize',
    'material.components.progressCircular',
    'ngAria',
    'mdColorPicker',
    'ui.drop',
    'ui.ace'
  ])
  .directive('stMapExplorer', stMapExplorer)
  .directive('stMerklePathTree', stMerklePathTree)
  .directive('stMapValidator', stMapValidator)
  .directive('stPromiseLoader', stPromiseLoader)
  .directive('stTagColorPicker', stTagColorPicker)
  .directive('stEvidences', stEvidences)
  .directive('stBitcoinEvidence', stBitcoinEvidence)
  .directive('stDummyEvidence', stDummyEvidence)
  .directive('stTmpopEvidence', stTmpopEvidence)
  .service('AceConfigurationService', AceConfigurationService)
  .service('ChainTreeBuilderService', ChainTreeBuilderService)
  .service('MapValidatorService', MapValidatorService)
  .controller('MapExplorerController', MapExplorerController)
  .filter('functionArguments', () => functionArguments)
  .filter('signaturesList', () => signaturesList).name;
