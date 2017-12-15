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
  this.set('evidence', {
    state: 'COMPLETE',
    backend: 'dummy',
    provider: 'dummy',
    proof: { timestamp: 1507798942 }
  });
  this.render(hbs`{{dummy-evidence evidence=evidence }}`);

  assert.equal(
    this.$().find('#timestamp')[0].innerHTML,
    'Thu, 12 Oct 2017 09:02:22 GMT'
  );
});
