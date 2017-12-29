export default function stBitcoinEvidence() {
  return {
    scope: {
      evidence: '=?'
    },
    templateUrl: '../views/bitcoinevidence.html',
    link: scope => {
      const { txid } = scope.evidence.proof;
      if (scope.evidence.provider.match(/test/)) {
        scope.evidence.url = `https://live.blockcypher.com/btc-testnet/tx/${txid}`;
      } else {
        scope.evidence.url = `https://blockchain.info/tx/${txid}`;
      }
    }
  };
}
