import Ember from 'ember';
import layout from '../templates/components/bitcoin-evidence';

export default Ember.Component.extend({
  layout,

  didReceiveAttrs() {
    const e = this.get('evidence');
    const txid = e.proof.txid;
    if (e.provider.match(/test/)) {
      this.set('url', `https://live.blockcypher.com/btc-testnet/tx/${txid}`);
    } else {
      this.set('url', `https://blockchain.info/tx/${txid}`);
    }

    this.set(
      'merklePathPresent',
      this.get('evidence').proof.batch.merklePath.length > 0
    );
  }
});
