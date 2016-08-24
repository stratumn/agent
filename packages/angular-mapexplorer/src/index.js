import angular from 'angular';
import 'angular-animate';
import 'angular-material';
import 'angular-aria';
import 'md-color-picker';
import 'angular-drop';

import stMerklePathTree from './stMerklePathTree.directive';
import stMapExplorer from './stMapExplorer.directive';
import stMapValidator from './stMapValidator.directive';
import stPromiseLoader from './stPromiseLoader.directive';
import stTagColorPicker from './stTagColorPicker.directive';
import AceConfigurationService from './AceConfiguration.service';
import ChainTreeBuilderService from './ChainTreeBuilder.service';
import MapValidatorService from './MapValidator.service';
import MapExplorerController from './MapExplorer.controller';
import functionArguments from './functionArguments.filter';

export default angular.module('stratumn.angular-mapexplorer',
  ['ngAnimate', 'ngMaterial', 'ngAria', 'mdColorPicker', 'ui.drop']
)
  .directive('stMapExplorer', stMapExplorer)
  .directive('stMerklePathTree', stMerklePathTree)
  .directive('stMapValidator', stMapValidator)
  .directive('stPromiseLoader', stPromiseLoader)
  .directive('stTagColorPicker', stTagColorPicker)
  .service('AceConfigurationService', AceConfigurationService)
  .service('ChainTreeBuilderService', ChainTreeBuilderService)
  .service('MapValidatorService', MapValidatorService)
  .controller('MapExplorerController', MapExplorerController)
  .filter('functionArguments', () => functionArguments)
  .name;

