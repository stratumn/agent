import Controller from "@ember/controller";

const chainscript_raw = `[
  {
    "link": {
      "state": { "author": "r", "body": "e" },
      "meta": {
        "action": "message",
        "arguments": ["e", "r"],
        "mapId": "dae2aab5-2395-44cb-8a50-e17f6b38bdcf",
        "prevLinkHash":
          "21400554ca647d7939aee4727193fba4170ce6a298b75642f593edf55ec940a5",
        "process": "a",
        "stateHash":
          "0929f0e308f9be55e5d6111a04dc90616a91cf90a1f5ad4999ca95a8ea9a7f1c"
      }
    },
    "meta": {
      "agentUrl": "http://localhost:3000",
      "evidences": [
        {
          "backend": "TMPop",
          "provider": "test-chain-5AKxd9",
          "proof": {
            "block_height": 89091,
            "merkle_root":
              "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
            "merkle_path": [
              {
                "left":
                  "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
                "right":
                  "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
                "parent":
                  "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
              }
            ],
            "validations_hash": null,
            "header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89091,
              "time": "2018-03-12T17:13:59.578+01:00",
              "last_commit_hash": "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
              "data_hash": "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
              "app_hash": "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
            },
            "header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89091,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            },
            "next_header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89092,
              "time": "2018-03-12T17:14:09.578+01:00",
              "last_block_id": {
                "hash": "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
                "parts": { "total": 1, "hash": "WzgF9gWDSS6ip3EE/AKkpeDf1CA=" }
              },
              "last_commit_hash": "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
              "app_hash": "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
            },
            "next_header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89092,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "next_header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            }
          }
        }
      ],
      "linkHash":
        "1349ad44a03ef8b206b378067f426ce54678dd2bb062db8050e129e24ee4d8fb",
      "segmentUrl":
        "http://localhost:3000/segments/1349ad44a03ef8b206b378067f426ce54678dd2bb062db8050e129e24ee4d8fb"
    }
  },
  {
    "link": {
      "state": { "author": "e", "body": "e" },
      "meta": {
        "action": "message",
        "arguments": ["e", "e"],
        "mapId": "dae2aab5-2395-44cb-8a50-e17f6b38bdcf",
        "prevLinkHash":
          "cf7461c740f83fee45fd26bceb40e9aec3a0cb61b957819863afdb2bbb8fab5e",
        "process": "a",
        "stateHash":
          "023c275a9843537d8cf41652765cbf40203f2dd9a51533bf4c3df81c795d4cf9"
      }
    },
    "meta": {
      "agentUrl": "http://localhost:3000",
      "evidences": [
        {
          "backend": "TMPop",
          "provider": "test-chain-5AKxd9",
          "proof": {
            "block_height": 89091,
            "merkle_root":
              "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
            "merkle_path": [
              {
                "left":
                  "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
                "right":
                  "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
                "parent":
                  "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
              }
            ],
            "validations_hash": null,
            "header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89091,
              "time": "2018-03-12T17:13:59.578+01:00",
              "last_commit_hash": "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
              "data_hash": "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
              "app_hash": "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
            },
            "header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89091,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            },
            "next_header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89092,
              "time": "2018-03-12T17:14:09.578+01:00",
              "last_block_id": {
                "hash": "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
                "parts": { "total": 1, "hash": "WzgF9gWDSS6ip3EE/AKkpeDf1CA=" }
              },
              "last_commit_hash": "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
              "app_hash": "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
            },
            "next_header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89092,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "next_header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            }
          }
        }
      ],
      "linkHash":
        "21400554ca647d7939aee4727193fba4170ce6a298b75642f593edf55ec940a5",
      "segmentUrl":
        "http://localhost:3000/segments/21400554ca647d7939aee4727193fba4170ce6a298b75642f593edf55ec940a5"
    }
  },
  {
    "link": {
      "state": { "author": "z", "body": "az" },
      "meta": {
        "action": "message",
        "arguments": ["az", "z"],
        "mapId": "dae2aab5-2395-44cb-8a50-e17f6b38bdcf",
        "prevLinkHash":
          "cf7461c740f83fee45fd26bceb40e9aec3a0cb61b957819863afdb2bbb8fab5e",
        "process": "a",
        "stateHash":
          "8ec3272baafcb91fc06cb7221612955671691ee329a4f524ab45b3d70403919f"
      }
    },
    "meta": {
      "agentUrl": "http://localhost:3000",
      "evidences": [
        {
          "backend": "TMPop",
          "provider": "test-chain-5AKxd9",
          "proof": {
            "block_height": 89091,
            "merkle_root":
              "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
            "merkle_path": [
              {
                "left":
                  "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
                "right":
                  "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
                "parent":
                  "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
              }
            ],
            "validations_hash": null,
            "header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89091,
              "time": "2018-03-12T17:13:59.578+01:00",
              "last_commit_hash": "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
              "data_hash": "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
              "app_hash": "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
            },
            "header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89091,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            },
            "next_header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89092,
              "time": "2018-03-12T17:14:09.578+01:00",
              "last_block_id": {
                "hash": "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
                "parts": { "total": 1, "hash": "WzgF9gWDSS6ip3EE/AKkpeDf1CA=" }
              },
              "last_commit_hash": "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
              "app_hash": "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
            },
            "next_header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89092,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "next_header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            }
          }
        }
      ],
      "linkHash":
        "252a1113c9293cafa3f9a37eb5489f1249d20492e6d7a7eba1affc2f9cbbc5c8",
      "segmentUrl":
        "http://localhost:3000/segments/252a1113c9293cafa3f9a37eb5489f1249d20492e6d7a7eba1affc2f9cbbc5c8"
    }
  },
  {
    "link": {
      "state": { "author": "azer", "body": "reazer" },
      "meta": {
        "action": "message",
        "arguments": ["reazer", "azer"],
        "mapId": "dae2aab5-2395-44cb-8a50-e17f6b38bdcf",
        "prevLinkHash":
          "21400554ca647d7939aee4727193fba4170ce6a298b75642f593edf55ec940a5",
        "process": "a",
        "stateHash":
          "04213e54410a6297aa6e1acd5f93136c667db8b42ac9892cdf2f3b21e55e6ebc"
      }
    },
    "meta": {
      "agentUrl": "http://localhost:3000",
      "evidences": [
        {
          "backend": "TMPop",
          "provider": "test-chain-5AKxd9",
          "proof": {
            "block_height": 89091,
            "merkle_root":
              "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
            "merkle_path": [
              {
                "left":
                  "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
                "right":
                  "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
                "parent":
                  "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
              }
            ],
            "validations_hash": null,
            "header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89091,
              "time": "2018-03-12T17:13:59.578+01:00",
              "last_commit_hash": "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
              "data_hash": "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
              "app_hash": "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
            },
            "header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89091,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            },
            "next_header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89092,
              "time": "2018-03-12T17:14:09.578+01:00",
              "last_block_id": {
                "hash": "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
                "parts": { "total": 1, "hash": "WzgF9gWDSS6ip3EE/AKkpeDf1CA=" }
              },
              "last_commit_hash": "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
              "app_hash": "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
            },
            "next_header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89092,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "next_header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            }
          }
        }
      ],
      "linkHash":
        "4840c5a933edcec0bb5f79a8580d15f51ddd7d139df455063543cd059c9c2daf",
      "segmentUrl":
        "http://localhost:3000/segments/4840c5a933edcec0bb5f79a8580d15f51ddd7d139df455063543cd059c9c2daf"
    }
  },
  {
    "link": {
      "state": { "author": "ze", "body": "ze" },
      "meta": {
        "action": "message",
        "arguments": ["ze", "ze"],
        "mapId": "dae2aab5-2395-44cb-8a50-e17f6b38bdcf",
        "prevLinkHash":
          "6824b9b8c87833d63e8ace90e75bea47131442ff388a1d64b364ab27feea2cba",
        "process": "a",
        "stateHash":
          "f84097f6b3a4d8332fc4a324d6ebc6ba56cb755b4f5e96ef8b1327f8a53cc630"
      }
    },
    "meta": {
      "agentUrl": "http://localhost:3000",
      "evidences": [
        {
          "backend": "TMPop",
          "provider": "test-chain-5AKxd9",
          "proof": {
            "block_height": 89091,
            "merkle_root":
              "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
            "merkle_path": [
              {
                "left":
                  "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
                "right":
                  "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
                "parent":
                  "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
              }
            ],
            "validations_hash": null,
            "header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89091,
              "time": "2018-03-12T17:13:59.578+01:00",
              "last_commit_hash": "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
              "data_hash": "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
              "app_hash": "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
            },
            "header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89091,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            },
            "next_header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89092,
              "time": "2018-03-12T17:14:09.578+01:00",
              "last_block_id": {
                "hash": "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
                "parts": { "total": 1, "hash": "WzgF9gWDSS6ip3EE/AKkpeDf1CA=" }
              },
              "last_commit_hash": "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
              "app_hash": "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
            },
            "next_header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89092,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "next_header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            }
          }
        }
      ],
      "linkHash":
        "a6c12f3621882a44d2619d094056de6ccdc5b5726c344b1b4387417a6f1d268e",
      "segmentUrl":
        "http://localhost:3000/segments/a6c12f3621882a44d2619d094056de6ccdc5b5726c344b1b4387417a6f1d268e"
    }
  },
  {
    "link": {
      "state": { "author": "ae", "body": "rz" },
      "meta": {
        "action": "message",
        "arguments": ["rz", "ae"],
        "mapId": "dae2aab5-2395-44cb-8a50-e17f6b38bdcf",
        "prevLinkHash":
          "21400554ca647d7939aee4727193fba4170ce6a298b75642f593edf55ec940a5",
        "process": "a",
        "stateHash":
          "13787241c0a147af319d3256b2ec28f5020dbe2b8f51043c11ecf48bf14b864d"
      }
    },
    "meta": {
      "agentUrl": "http://localhost:3000",
      "evidences": [
        {
          "backend": "TMPop",
          "provider": "test-chain-5AKxd9",
          "proof": {
            "block_height": 89091,
            "merkle_root":
              "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
            "merkle_path": [
              {
                "left":
                  "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
                "right":
                  "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
                "parent":
                  "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
              }
            ],
            "validations_hash": null,
            "header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89091,
              "time": "2018-03-12T17:13:59.578+01:00",
              "last_commit_hash": "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
              "data_hash": "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
              "app_hash": "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
            },
            "header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89091,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            },
            "next_header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89092,
              "time": "2018-03-12T17:14:09.578+01:00",
              "last_block_id": {
                "hash": "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
                "parts": { "total": 1, "hash": "WzgF9gWDSS6ip3EE/AKkpeDf1CA=" }
              },
              "last_commit_hash": "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
              "app_hash": "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
            },
            "next_header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89092,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "next_header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            }
          }
        }
      ],
      "linkHash":
        "6824b9b8c87833d63e8ace90e75bea47131442ff388a1d64b364ab27feea2cba",
      "segmentUrl":
        "http://localhost:3000/segments/6824b9b8c87833d63e8ace90e75bea47131442ff388a1d64b364ab27feea2cba"
    }
  },
  {
    "link": {
      "state": { "author": "e", "body": "e" },
      "meta": {
        "action": "message",
        "arguments": ["e", "e"],
        "mapId": "dae2aab5-2395-44cb-8a50-e17f6b38bdcf",
        "prevLinkHash":
          "252a1113c9293cafa3f9a37eb5489f1249d20492e6d7a7eba1affc2f9cbbc5c8",
        "process": "a",
        "stateHash":
          "023c275a9843537d8cf41652765cbf40203f2dd9a51533bf4c3df81c795d4cf9"
      }
    },
    "meta": {
      "agentUrl": "http://localhost:3000",
      "evidences": [
        {
          "backend": "TMPop",
          "provider": "test-chain-5AKxd9",
          "proof": {
            "block_height": 89091,
            "merkle_root":
              "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
            "merkle_path": [
              {
                "left":
                  "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
                "right":
                  "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
                "parent":
                  "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
              }
            ],
            "validations_hash": null,
            "header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89091,
              "time": "2018-03-12T17:13:59.578+01:00",
              "last_commit_hash": "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
              "data_hash": "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
              "app_hash": "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
            },
            "header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89091,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            },
            "next_header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89092,
              "time": "2018-03-12T17:14:09.578+01:00",
              "last_block_id": {
                "hash": "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
                "parts": { "total": 1, "hash": "WzgF9gWDSS6ip3EE/AKkpeDf1CA=" }
              },
              "last_commit_hash": "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
              "app_hash": "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
            },
            "next_header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89092,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "next_header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            }
          }
        }
      ],
      "linkHash":
        "77ca72c7400df035cc785158861201ea4b953c00a5e8e7e182afcfd05bf14cac",
      "segmentUrl":
        "http://localhost:3000/segments/77ca72c7400df035cc785158861201ea4b953c00a5e8e7e182afcfd05bf14cac"
    }
  },
  {
    "link": {
      "state": { "title": "e" },
      "meta": {
        "action": "init",
        "arguments": ["e"],
        "mapId": "dae2aab5-2395-44cb-8a50-e17f6b38bdcf",
        "process": "a",
        "stateHash":
          "b2afee18f8e153d8e62e5bd58e47ad511ce4d112fbaad675612e88c4ba4c0d37"
      }
    },
    "meta": {
      "agentUrl": "http://localhost:3000",
      "evidences": [
        {
          "backend": "TMPop",
          "provider": "test-chain-5AKxd9",
          "proof": {
            "block_height": 89091,
            "merkle_root":
              "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f",
            "merkle_path": [
              {
                "left":
                  "0185cc20bc088fb86eab72f6f921ee568d2be13d0ee273520ebfb916e47cd989",
                "right":
                  "77bf231be035c74eef22e75b34bed58afcc69a361787c77d55b2ce77b9c886c9",
                "parent":
                  "85e44eee398c3f123cbfabc1c3262392a5f8822da8719552312f6bd7ccd3d79f"
              }
            ],
            "validations_hash": null,
            "header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89091,
              "time": "2018-03-12T17:13:59.578+01:00",
              "last_commit_hash": "toAVRGGIdaIf2bjqyYwzRlcYv/E=",
              "data_hash": "OBj8lq6mSXgE9S7KRtTkAppQbuM=",
              "app_hash": "67pv8OR2/ISQtEoYc+3hN0z1UddUePspJkwD4mgUweM="
            },
            "header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89091,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            },
            "next_header": {
              "chain_id": "test-chain-5AKxd9",
              "height": 89092,
              "time": "2018-03-12T17:14:09.578+01:00",
              "last_block_id": {
                "hash": "LA9SfFiog1IFNFEJ89A6lCtOr6Y=",
                "parts": { "total": 1, "hash": "WzgF9gWDSS6ip3EE/AKkpeDf1CA=" }
              },
              "last_commit_hash": "GvkA0lEZ/ygQuBbo5v/qGqFy9bo=",
              "app_hash": "0U7AaZEW6gBI4Wk4Jg8vLTtgxkJFtXZRkTwWhnjiUVo="
            },
            "next_header_votes": [
              {
                "pub_key": {
                  "type": "ed25519",
                  "data":
                    "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                },
                "vote": {
                  "validator_address":
                    "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "validator_index": 0,
                  "height": 89092,
                  "round": 0,
                  "type": 0,
                  "block_id": {
                    "hash": "600DC9E2706D8EEF1D8078DCF7EB267652745A39",
                    "parts": { "total": 0, "hash": "" }
                  },
                  "signature": {
                    "type": "ed25519",
                    "data":
                      "57BD6F49872B2DBA612C1C61A3B0EC79C8E8AFD3E73816F4616F362738D59DC42F22976D44374E522D4E0741D4A16E0618E7B3129A9DB61A3EE9B6E1F0A52007"
                  }
                }
              }
            ],
            "next_header_validator_set": {
              "validators": [
                {
                  "address": "B62F4950711E8B3A71E4E1DF63BD8041560D5F2A",
                  "pub_key": {
                    "type": "ed25519",
                    "data":
                      "A3682EE3EBF9E44B3A3E50748AD57CFBF8EFC65BDB8EBF39C47A2C613C41F00A"
                  },
                  "voting_power": 30,
                  "accum": 0
                }
              ]
            }
          }
        }
      ],
      "linkHash":
        "cf7461c740f83fee45fd26bceb40e9aec3a0cb61b957819863afdb2bbb8fab5e",
      "segmentUrl":
        "http://localhost:3000/segments/cf7461c740f83fee45fd26bceb40e9aec3a0cb61b957819863afdb2bbb8fab5e"
    }
  }
]`
;

var cs = JSON.parse(chainscript_raw);
var parents_cs = cs.filter(
  s =>
    s.link.meta.prevLinkHash ===
      "21400554ca647d7939aee4727193fba4170ce6a298b75642f593edf55ec940a5" &&
    s.meta.linkHash !==
      "6824b9b8c87833d63e8ace90e75bea47131442ff388a1d64b364ab27feea2cba"
);
var child_1 = cs.find(
  s =>
    s.meta.linkHash ===
    "a6c12f3621882a44d2619d094056de6ccdc5b5726c344b1b4387417a6f1d268e"
);
child_1.link.meta.refs = [];
parents_cs.map(s => child_1.link.meta.refs.push({ linkHash: s.meta.linkHash }));
child_1.link.meta.refs.push({
  process: "z",
  mapId: "ddde0416-c772-478c-b64f-4a095f5de11b",
  linkHash: "6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c"
});

var child_2 = cs.find(
  s =>
    s.meta.linkHash ===
    "77ca72c7400df035cc785158861201ea4b953c00a5e8e7e182afcfd05bf14cac"
);
child_2.link.meta.refs = [];
child_2.link.meta.refs.push({
  process: "z",
  mapId: "ddde0416-c772-478c-b64f-4a095f5de11b",
  linkHash: "6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c"
});
child_2.link.meta.refs.push({
  process: "e",
  mapId: "5c950598-0473-4002-82ab-efe4797e851e",
  linkHash: "b9945e1f2cfa197235b07dc6505933adfcad911ee803a419f93fd6b1024fbb1b"
});

export default Controller.extend({
  cs: JSON.stringify(cs)
});
