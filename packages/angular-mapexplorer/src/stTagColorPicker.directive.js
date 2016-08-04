import hashStringToColor from './hashToStringColor';
import template from '../views/tagcolorpicker.html';

export default function stTagColorPicker() {

  function setTagStyle(scope) {
    scope.tagStyle = `.${scope.tag} polygon { stroke: ${scope.color}; stroke-width: 5px; }`
      + `.${scope.tag} rect { stroke-dasharray: 0,78,25,78,25; `
      + `stroke: ${scope.color}; stroke-width: 5px}`;
  }

  return {
    restrict: 'E',
    scope: {
      tag: '='
    },
    templateUrl: template,
    link: (scope) => {
      scope.color = hashStringToColor(scope.tag);


      setTagStyle(scope);

      scope.$watch('color', () => {
        setTagStyle(scope);
      });
    }
  };
}

