import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent(
  'tmpop-evidence',
  'Integration | Component | tmpop evidence',
  {
    integration: true
  }
);

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('evidence', {
    backend: 'TMPop',
    provider: 'test-chain-5AKxd9',
    proof: {
      blockHeight: 89091,
      merkleRoot:
        '85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f',
      merklePath: [
        {
          left:
            '0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989',
          right:
            '77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9',
          parent:
            '85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f'
        }
      ],
      validationsHash: null,
      header: {
        chain_id: 'test-chain-5AKxd9',
        height: 89091,
        time: 1513260611,
        last_commit_hash: 'toAVRGGIdaIf2bjqyYwzRlcYv/E=',
        data_hash: 'OBj8lq6mSXgE9S7KRtTkAppQbuM=',
        app_hash: '67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM='
      },
      signatures: null,
      nextHeader: {
        chain_id: 'test-chain-5AKxd9',
        height: 89092,
        time: 1513260621,
        last_block_id: {
          hash: 'LA9SfFiog1IFNFEJ89A6lCtOr6Y=',
          parts: { total: 1, hash: 'WzgF9gWDSS6ip3EE/AKkpeDf1CA=' }
        },
        last_commit_hash: 'GvkA0lEZ/ygQuBbo5v/qGqFy9bo=',
        app_hash: '0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo='
      },
      nextSignatures: null
    }
  });

  this.render(hbs`{{tmpop-evidence evidence=evidence}}`);

  assert.equal(this.$().find('p')[0].innerHTML, 'test-chain-5AKxd9');
});
