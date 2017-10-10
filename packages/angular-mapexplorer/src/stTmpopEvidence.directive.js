export default function stTmpopEvidence() {
  return {
    scope: {
      evidence: '=?'
    },
    templateUrl: '../views/tmpopevidence.html',
    link: scope => {
      scope.evidence.merklePathString = JSON.stringify(
        scope.evidence.proof.original.merkleProof.InnerNodes
      );
    }
  };
}
