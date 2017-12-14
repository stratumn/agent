export default function stTmpopEvidence() {
  return {
    scope: {
      evidence: '=?'
    },
    templateUrl: '../views/tmpopevidence.html',
    link: scope => {
      scope.evidence.date = new Date(
        scope.evidence.proof.header.time * 1000
      ).toUTCString();
    }
  };
}
