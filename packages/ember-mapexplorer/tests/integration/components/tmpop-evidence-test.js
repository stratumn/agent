import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent(
  "tmpop-evidence",
  "Integration | Component | tmpop evidence",
  {
    integration: true
  }
);

test("it renders", function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set("evidence", {
    backend: "TMPop",
    provider: "test-chain-5AKxd9",
    proof: {
      block_height: 89091,
      merkle_root:
        "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
      merkle_path: [
        {
          left:
            "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
          right:
            "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
          parent:
            "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
        }
      ],
      validations_hash: null,
      header: {
        chain_id: "test-chain-5AKxd9",
        height: 89091,
        time: "2018-03-12T17:13:59.578+01:00",
        last_commit_hash: "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
        data_hash: "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
        app_hash: "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
      },
      header_votes: [
        {
          pub_key: {
            type: "ed25519",
            data:
              "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
          },
          vote: {
            validator_address: "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
            validator_index: 0,
            height: 89091,
            round: 0,
            type: 0,
            block_id: {
              hash: "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
              parts: {
                total: 0,
                hash: ""
              }
            },
            signature: {
              type: "ed25519",
              data:
                "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
            }
          }
        }
      ],
      header_validator_set: {
        validators: [
          {
            address: "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
            pub_key: {
              type: "ed25519",
              data:
                "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
            },
            voting_power: 30,
            accum: 0
          }
        ]
      },
      next_header: {
        chain_id: "test-chain-5AKxd9",
        height: 89092,
        time: "2018-03-12T17:14:09.578+01:00",
        last_block_id: {
          hash: "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
          parts: {
            total: 1,
            hash: "WzgF9gWDSS6ip3EE/AKkpeDf1CA="
          }
        },
        last_commit_hash: "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
        app_hash: "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
      },
      next_header_votes: [
        {
          pub_key: {
            type: "ed25519",
            data:
              "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
          },
          vote: {
            validator_address: "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
            validator_index: 0,
            height: 89092,
            round: 0,
            type: 0,
            block_id: {
              hash: "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
              parts: {
                total: 0,
                hash: ""
              }
            },
            signature: {
              type: "ed25519",
              data:
                "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
            }
          }
        }
      ],
      next_header_validator_set: {
        validators: [
          {
            address: "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
            pub_key: {
              type: "ed25519",
              data:
                "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
            },
            voting_power: 30,
            accum: 0
          }
        ]
      }
    }
  });

  this.render(hbs`{{tmpop-evidence evidence=evidence}}`);

  assert.equal(this.$().find("p")[0].innerHTML, "test-chain-5AKxd9");
});
