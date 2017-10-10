export default function stDummyEvidence() {
  return {
    scope: {
      evidence: '=?'
    },
    templateUrl: '../views/dummyevidence.html',
    link: scope => {
      scope.evidence.date = new Date(
        scope.evidence.proof.timestamp * 1000
      ).toUTCString();
    }
  };
}
