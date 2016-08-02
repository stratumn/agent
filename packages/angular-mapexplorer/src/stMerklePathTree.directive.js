import { MerklePathTree } from 'mapexplorer-core';

export default function stMerklePathTree() {
  return {
    restrict: 'E',
    scope: {
      merklePath: '='
    },
    template: '<svg></svg>',
    link: (scope, element) => {
      const merklePathTree = new MerklePathTree(element);
      scope.$watch('merklePath', () => merklePathTree.display(scope.merklePath));
    }
  };
}
