import stMerklePathTree from './stMerklePathTree.directive';
import stMapExplorer from './stMapExplorer.directive';
import stMapValidator from './stMapValidator.directive';
import stPromiseLoader from './stPromiseLoader.directive';
import stTagColorPicker from './stTagColorPicker.directive';
import AceConfigurationService from './AceConfiguration.service';

angular.module('stratumn.angular-mapexplorer', ['mgcrea.jquery', 'mdColorPicker', 'ui.drop'])
  .directive('stMapExplorer', stMapExplorer)
  .directive('stMerklePathTree', stMerklePathTree)
  .directive('stMapValidator', stMapValidator)
  .directive('stPromiseLoader', stPromiseLoader)
  .directive('stTagColorPicker', stTagColorPicker)
  .service('AceConfigurationService', AceConfigurationService);
