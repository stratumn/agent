import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('timestamp', 'helper:timestamp', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1513260611');

  this.render(hbs`{{timestamp inputValue}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    'Thu, 14 Dec 2017 14:10:11 GMT'
  );
});
