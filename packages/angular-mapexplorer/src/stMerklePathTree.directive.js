export default function stMerklePathTree() {
  return {
    restrict: 'E',
    scope: {
      merklePath: '='
    },
    template: '<svg></svg>',
    link: (scope, element) => {
      const merklePathTree = new MapexplorerCore.MerklePathTree(element);
      scope.$watch('merklePath', () => merklePathTree.display(scope.merklePath));
    }
  };
}
