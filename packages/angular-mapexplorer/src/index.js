import stMerklePathTree from './stMerklePathTree.directive';
import stMapExplorer from './stMapExplorer.directive';
import stMapValidator from './stMapValidator.directive';
import stPromiseLoader from './stPromiseLoader.directive';
import stTagColorPicker from './stTagColorPicker.directive';
import AceConfigurationService from './AceConfiguration.service';
import mdColorPicker from 'md-color-picker';
import uiDrop from 'angular-drop/AngularDrop';
import configureTemplates from './templates';

angular.module('stratumn.angular-mapexplorer',
  [mdColorPicker, uiDrop]
)
  .directive('stMapExplorer', stMapExplorer)
  .directive('stMerklePathTree', stMerklePathTree)
  .directive('stMapValidator', stMapValidator)
  .directive('stPromiseLoader', stPromiseLoader)
  .directive('stTagColorPicker', stTagColorPicker)
  .service('AceConfigurationService', AceConfigurationService)
  .run(['$templateCache', configureTemplates]);

