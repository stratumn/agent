import { join } from 'dummy/helpers/join';
import { module, test } from 'qunit';

module('Unit | Helper | join');

test('it works', function(assert) {
  let result = join([[42, 43]], { delimiter: ', ' });
  assert.ok(result === '42, 43');
});
