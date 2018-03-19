export default function stTmpopEvidence() {
  return {
    scope: {
      evidence: '=?'
    },
    link: scope => {
      scope.evidence.votes = scope.evidence.proof.header_votes.map(
        v => v.vote.validator_address
      );
      scope.evidence.validators = scope.evidence.proof.header_validator_set.validators.map(
        v => v.address
      );

      scope.evidence.nextVotes = scope.evidence.proof.next_header_votes.map(
        v => v.vote.validator_address
      );
      scope.evidence.nextValidators = scope.evidence.proof.next_header_validator_set.validators.map(
        v => v.address
      );
    },
    templateUrl: '../views/tmpopevidence.html'
  };
}
