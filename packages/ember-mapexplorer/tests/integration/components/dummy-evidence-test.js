import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'dummy-evidence',
  'Integration | Component | dummy evidence',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  this.render(
    hbs`{{dummy-evidence evidence='{state: "COMPLETE",backend: "dummy",provider: "dummy",proof: {timestamp: 1507798942}}' }}`
  );
  assert.equal(0, 0);
});
