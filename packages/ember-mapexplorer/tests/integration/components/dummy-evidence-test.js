import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dummy-evidence', 'Integration | Component | dummy evidence', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{dummy-evidence evidence='{"authority":"dummy","state":"COMPLETE","timestamp":"20171003144209"}'}}`);

  assert.equal(0, 0);
});
