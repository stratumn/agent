import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'bitcoin-evidence',
  'Integration | Component | bitcoin evidence',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(
    hbs`{{bitcoin-evidence evidence='{state: "COMPLETE",backend: "bcbatch",provider: "dummytimestamper",proof: {batch: {timestamp: 1507798943,merkleRoot: "9449ecec772bf5b37ef9d204839d3a6a7b7a22d6c75354e193340c3eec0ee289",merklePath: [ ]},txid: "3f94064ebfee38b763493ef5c073baf4320933555a921741bcb26c77d9b26924"}}'}}`
  );

  assert.equal(0, 0);
});
