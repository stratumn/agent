import Controller from "@ember/controller";

const chainscript_raw = `[
  {
      "link": {
          "state": {
              "author": "z",
              "body": "z"
          },
          "meta": {
              "mapId": "17a7719d-7970-41b3-a272-b5fe70c9ddeb",
              "process": "two",
              "action": "message",
              "type": "message",
              "inputs": [
                  "z",
                  "z"
              ],
              "tags": null,
              "priority": 0,
              "prevLinkHash": "e77d69eae359950a73e191340b677165c12bc1c69f4190e2c85d3731f9f58f2b",
              "refs": [],
              "data": {
                  "agentVersion": "0.3.0-rc2",
                  "stateHash": "95e003faab679572485e706a0d08f3fbc015ef9315920db914157979cf1e5e64"
              }
          },
          "signatures": []
      },
      "meta": {
          "evidences": [
              {
                  "backend": "TMPop",
                  "provider": "test-chain-QV6awA",
                  "proof": {
                      "block_height": 4240,
                      "merkle_root": "1804859b684144e0aec98b40a0ba601d02f10261cac3c1cdb10c8b790c941893",
                      "merkle_path": [],
                      "validations_hash": "9711620370185b6b966eaba989205cb31158bad5b446e4926ae66ba5f97dcfd6",
                      "header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 4240,
                          "time": "2018-04-11T12:50:27.03Z",
                          "num_txs": 1,
                          "last_block_id": {
                              "hash": "80D0A9BD35D2D4C3636F4511DCCE13720287C03B",
                              "parts": {
                                  "total": 1,
                                  "hash": "4020D5BC12D0F38B27AE4BAAE5A3BD8315F56660"
                              }
                          },
                          "total_txs": 5,
                          "last_commit_hash": "729F9BB1B64E2292524E623569D00879806D3EE5",
                          "data_hash": "B104CC7D146665C5B2BF7F242E5B383B0A167524",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "48DE6EA51B410BA1AAF827987C196D5FAF19F41AE2E686E31ED63B94156CCC12",
                          "last_results_hash": "",
                          "evidence_hash": ""
                      },
                      "header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 4240,
                                  "round": 0,
                                  "timestamp": "2018-04-11T12:50:27.041Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "D9A7BB9888383391F9B4214C54811185C48CC5C3",
                                      "parts": {
                                          "total": 1,
                                          "hash": "DE1AEE90494E4BE4ECCB1DD48D7BC238F673F0A8"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "A795F63C4DDF651FE349D4177F558E3EB20ADE000E3733A78CAB1FDE72B55FB1026A5560DAB809555CAEBEC1A0853F5D57EBB4BE928493F48A87C42B4F15A105"
                                  }
                              }
                          }
                      ],
                      "header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      },
                      "next_header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 4241,
                          "time": "2018-04-11T12:50:28.049Z",
                          "num_txs": 0,
                          "last_block_id": {
                              "hash": "D9A7BB9888383391F9B4214C54811185C48CC5C3",
                              "parts": {
                                  "total": 1,
                                  "hash": "DE1AEE90494E4BE4ECCB1DD48D7BC238F673F0A8"
                              }
                          },
                          "total_txs": 5,
                          "last_commit_hash": "31E9DE7A43282B13DE8CA7D86B78799BD8D19E9F",
                          "data_hash": "",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "C6DB04CD1E2DEBC742C15D9BEC80388B3EF5DFF94DA5884357BA7BF468A29E10",
                          "last_results_hash": "585BD7ED566208944B1F2E13170CD4B66325B8EE",
                          "evidence_hash": ""
                      },
                      "next_header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 4241,
                                  "round": 0,
                                  "timestamp": "2018-04-11T12:50:28.06Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "8F22787CDD6C5A28AA357F7E29B2FF98441CD15C",
                                      "parts": {
                                          "total": 1,
                                          "hash": "7659DBCF6ACE1DAC3FEEFACFE3FB9B571193B598"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "07B0D462210C88B5339238EA8CB758BC05578AF3813289D069E015922F54A945CC19D7DE57707E1ECEA22E65040D6E7030A236CB7A881176833CC7C416800C06"
                                  }
                              }
                          }
                      ],
                      "next_header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      }
                  }
              }
          ],
          "linkHash": "1804859b684144e0aec98b40a0ba601d02f10261cac3c1cdb10c8b790c941893",
          "agentUrl": "http://agent:3000",
          "segmentUrl": "http://agent:3000/two/segments/1804859b684144e0aec98b40a0ba601d02f10261cac3c1cdb10c8b790c941893"
      }
  },
  {
      "link": {
          "state": {
              "author": "ez",
              "body": "e"
          },
          "meta": {
              "mapId": "17a7719d-7970-41b3-a272-b5fe70c9ddeb",
              "process": "two",
              "action": "message",
              "type": "message",
              "inputs": [
                  "e",
                  "ez"
              ],
              "tags": null,
              "priority": 0,
              "prevLinkHash": "e77d69eae359950a73e191340b677165c12bc1c69f4190e2c85d3731f9f58f2b",
              "refs": [],
              "data": {
                  "agentVersion": "0.3.0-rc2",
                  "stateHash": "92b3c0aa511425110afd34ca67d9ef96590bf4cbe2b351d81d070baeb6d0c8a6"
              }
          },
          "signatures": []
      },
      "meta": {
          "evidences": [
              {
                  "backend": "TMPop",
                  "provider": "test-chain-QV6awA",
                  "proof": {
                      "block_height": 4274,
                      "merkle_root": "675841c75678924770d0c780a8e021c7a33e0da314e592514de60b2ac53dddef",
                      "merkle_path": [],
                      "validations_hash": "9711620370185b6b966eaba989205cb31158bad5b446e4926ae66ba5f97dcfd6",
                      "header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 4274,
                          "time": "2018-04-11T12:51:01.65Z",
                          "num_txs": 1,
                          "last_block_id": {
                              "hash": "C111DF9F2DCB2CF5A72B2C3B9F19D9884B6561C9",
                              "parts": {
                                  "total": 1,
                                  "hash": "52F8761A3CDA9E0DB5203162F2309C1949F4C6F4"
                              }
                          },
                          "total_txs": 7,
                          "last_commit_hash": "535168D179B9EE07AB560A8D296A198CDB1E63B1",
                          "data_hash": "9AD71B5A628AACF4A80939937CD948455811A485",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "BB15CC766E3CC29F9B858CFA31662771DB1654B25B4B59915ACD2CEA67D93CA0",
                          "last_results_hash": "",
                          "evidence_hash": ""
                      },
                      "header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 4274,
                                  "round": 0,
                                  "timestamp": "2018-04-11T12:51:01.66Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "95503DB3A30C72B688081FDE6AF54A0216411E4C",
                                      "parts": {
                                          "total": 1,
                                          "hash": "2267746AF23D3CE27B77DB5A04BB753EF2E459CD"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "95B2FF07C8ECA87A7808596E1E32A2F01284780F6753308E2D7C2577D3353C334266534557D5D06C37F7DA873D679580CE7043212A527B880B2D816D14DAF70F"
                                  }
                              }
                          }
                      ],
                      "header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      },
                      "next_header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 4275,
                          "time": "2018-04-11T12:51:02.67Z",
                          "num_txs": 0,
                          "last_block_id": {
                              "hash": "95503DB3A30C72B688081FDE6AF54A0216411E4C",
                              "parts": {
                                  "total": 1,
                                  "hash": "2267746AF23D3CE27B77DB5A04BB753EF2E459CD"
                              }
                          },
                          "total_txs": 7,
                          "last_commit_hash": "009431D72A227A370D670DF30F52B5487C1D3A18",
                          "data_hash": "",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "E6DDAE6BC84A1BEFAE21265A62DCE71EA5EFF9E5C293184C3C5B4BEA28DAA089",
                          "last_results_hash": "585BD7ED566208944B1F2E13170CD4B66325B8EE",
                          "evidence_hash": ""
                      },
                      "next_header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 4275,
                                  "round": 0,
                                  "timestamp": "2018-04-11T12:51:02.68Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "ADE944D71B6B45B1BD0F18A853FF997FB56E772A",
                                      "parts": {
                                          "total": 1,
                                          "hash": "7E4BDC94690E272B1E223F579479929E49C58EFF"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "8B8B0FC1512596BE8EB022EA9C26D76FF455A488A2388A84BFFA841671FA2337A6AFF4AD6774EBBAC17B233F92F6A37740DC4C5AEEB9A90855380ED601C5C10A"
                                  }
                              }
                          }
                      ],
                      "next_header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      }
                  }
              }
          ],
          "linkHash": "675841c75678924770d0c780a8e021c7a33e0da314e592514de60b2ac53dddef",
          "agentUrl": "http://agent:3000",
          "segmentUrl": "http://agent:3000/two/segments/675841c75678924770d0c780a8e021c7a33e0da314e592514de60b2ac53dddef"
      }
  },
  {
      "link": {
          "state": {
              "author": "z",
              "body": "aze"
          },
          "meta": {
              "mapId": "17a7719d-7970-41b3-a272-b5fe70c9ddeb",
              "process": "two",
              "action": "message",
              "type": "message",
              "inputs": [
                  "aze",
                  "z"
              ],
              "tags": null,
              "priority": 0,
              "prevLinkHash": "f356b213f1f11e6df31b444949a28bc35c37088a278d4f522be7a1c1cc4f1681",
              "refs": [],
              "data": {
                  "agentVersion": "0.3.0-rc2",
                  "stateHash": "c0a27c57dad1dd6f9db0a6436f95475c552cadb77e2130215e7608078c94aad3"
              }
          },
          "signatures": [
              {
                  "type": "ED25519",
                  "publicKey": "-----BEGIN ED25519 PUBLIC KEY-----\\nMCowBQYDK2VwAyEAUO+GZuE89tcLcxBNUloDLk4O9BXTCkVIA0tWoAb0NdU=\\n-----END ED25519 PUBLIC KEY-----",
                  "signature": "-----BEGIN MESSAGE-----\\nxbiLbyFCXCr8E9xGr5CXNJCc51ymmp80hjE57Dd68b1EoKpISeRopigMZloyukxB\\ngeR9PBPUbCJJ7jE9WXGcBg==\\n-----END MESSAGE-----",
                  "payload": "[meta.inputs,meta.action,meta.refs[*].linkHash,meta.prevLinkHash]"
              }
          ]
      },
      "meta": {
          "evidences": [
              {
                  "backend": "TMPop",
                  "provider": "test-chain-QV6awA",
                  "proof": {
                      "block_height": 4234,
                      "merkle_root": "db2f637f253ec4b00b06571d8e8ee6d9cfae7e5191400a8e9e64fedbe41c4c7e",
                      "merkle_path": [],
                      "validations_hash": "9711620370185b6b966eaba989205cb31158bad5b446e4926ae66ba5f97dcfd6",
                      "header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 4234,
                          "time": "2018-04-11T12:50:20.932Z",
                          "num_txs": 1,
                          "last_block_id": {
                              "hash": "C476826479223BE60895CD2B0FDD3FD53C8F8A1F",
                              "parts": {
                                  "total": 1,
                                  "hash": "E8704CE943DD57928BE873E9FE804EF2163F644F"
                              }
                          },
                          "total_txs": 4,
                          "last_commit_hash": "424045AA689C2CBB18316B4A064C7E91DAB7D5E0",
                          "data_hash": "CC89EDD94CF255ED5A324825ABAD614BA6FB1CEA",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "F6A6C8A8804649740D13BCB5190B5C8F24A80E8626AFF790FAB2241D3035BC92",
                          "last_results_hash": "",
                          "evidence_hash": ""
                      },
                      "header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 4234,
                                  "round": 0,
                                  "timestamp": "2018-04-11T12:50:20.941Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "0ACFB6183FA85EDDAD20E4D7796C54A06E375A74",
                                      "parts": {
                                          "total": 1,
                                          "hash": "EB487164A24B70BEAD0B517EC87956BFB2CF7205"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "AEB666225950698DB4E3D29798742276A1BDFEAA1C2E115DFC71D7FBA89814E76D1135F098B512BA25666F8DB62E5A8EF402E44A1B58166F7C5964B32E6E850B"
                                  }
                              }
                          }
                      ],
                      "header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      },
                      "next_header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 4235,
                          "time": "2018-04-11T12:50:21.948Z",
                          "num_txs": 0,
                          "last_block_id": {
                              "hash": "0ACFB6183FA85EDDAD20E4D7796C54A06E375A74",
                              "parts": {
                                  "total": 1,
                                  "hash": "EB487164A24B70BEAD0B517EC87956BFB2CF7205"
                              }
                          },
                          "total_txs": 4,
                          "last_commit_hash": "A5F66141F44D1A83883E10C3240A257CFA290167",
                          "data_hash": "",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "FA9AD7691C41FE50660B71D8CDB48668B5B69B05658846469AA13955C3676CF8",
                          "last_results_hash": "585BD7ED566208944B1F2E13170CD4B66325B8EE",
                          "evidence_hash": ""
                      },
                      "next_header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 4235,
                                  "round": 0,
                                  "timestamp": "2018-04-11T12:50:21.957Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "37C083F062B897A7A029C734781ADBB3A0AA463D",
                                      "parts": {
                                          "total": 1,
                                          "hash": "C44DD14F426495C446951D9BB8C189261767CD21"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "89CCB97681411547516077EB7F58A5ECFAC855300018AE91059D38BCEB45833449BA1D642103F263949099C21BCC6D10650395910B02B6EFA486CD1B5095B10D"
                                  }
                              }
                          }
                      ],
                      "next_header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      }
                  }
              }
          ],
          "linkHash": "db2f637f253ec4b00b06571d8e8ee6d9cfae7e5191400a8e9e64fedbe41c4c7e",
          "agentUrl": "http://agent:3000",
          "segmentUrl": "http://agent:3000/two/segments/db2f637f253ec4b00b06571d8e8ee6d9cfae7e5191400a8e9e64fedbe41c4c7e"
      }
  },
  {
      "link": {
          "state": {
              "author": "e",
              "body": "e"
          },
          "meta": {
              "mapId": "17a7719d-7970-41b3-a272-b5fe70c9ddeb",
              "process": "two",
              "action": "message",
              "type": "message",
              "inputs": [
                  "e",
                  "e"
              ],
              "tags": null,
              "priority": 0,
              "prevLinkHash": "f356b213f1f11e6df31b444949a28bc35c37088a278d4f522be7a1c1cc4f1681",
              "refs": [
                  {
                      "segment": {
                          "link": {
                              "state": {
                                  "title": "zre"
                              },
                              "meta": {
                                  "mapId": "35a62354-6c7a-4e87-9950-f60dc5089058",
                                  "process": "one",
                                  "action": "init",
                                  "type": "init",
                                  "inputs": [
                                      "zre"
                                  ],
                                  "tags": null,
                                  "priority": 0,
                                  "prevLinkHash": "",
                                  "refs": [],
                                  "data": {
                                      "agentVersion": "0.3.0-rc2",
                                      "stateHash": "955348d71e229df6b9b4974b31510acba4afd867fced2283da134e815e0e878d"
                                  }
                              },
                              "signatures": []
                          },
                          "meta": {
                              "evidences": [
                                  {
                                      "backend": "TMPop",
                                      "provider": "test-chain-QV6awA",
                                      "proof": {
                                          "block_height": 158,
                                          "merkle_root": "dc0f6ebd2b0d2eb78bbf37a9fea314529083ea4d6bddcd2e1f195a3d1b07d091",
                                          "merkle_path": [],
                                          "validations_hash": "9711620370185b6b966eaba989205cb31158bad5b446e4926ae66ba5f97dcfd6",
                                          "header": {
                                              "chain_id": "test-chain-QV6awA",
                                              "height": 158,
                                              "time": "2018-04-11T07:51:50.878Z",
                                              "num_txs": 1,
                                              "last_block_id": {
                                                  "hash": "A5455EAAAB1EEB76507DB182AFD7E10D41259E61",
                                                  "parts": {
                                                      "total": 1,
                                                      "hash": "9FC672E9E144F8F750B6E101F12C7B0663CB9FC5"
                                                  }
                                              },
                                              "total_txs": 1,
                                              "last_commit_hash": "7D0DDE0D8DAF24ECA82584C83EFE11F3DB470A7C",
                                              "data_hash": "4CE0DB296EF03D2A0659201A0CD278443A9BF2A4",
                                              "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                                              "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                                              "app_hash": "A0032BF690A88A8B116CAD6DB1B7658D6FE9D8DDCD3A8F4AB31765D73D4CDB67",
                                              "last_results_hash": "",
                                              "evidence_hash": ""
                                          },
                                          "header_votes": [
                                              {
                                                  "pub_key": {
                                                      "type": "ed25519",
                                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                                  },
                                                  "vote": {
                                                      "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                                      "validator_index": 0,
                                                      "height": 158,
                                                      "round": 0,
                                                      "timestamp": "2018-04-11T07:51:50.888Z",
                                                      "type": 2,
                                                      "block_id": {
                                                          "hash": "E74927D9E4EE86AF1913ABE78335E740D14AF6F3",
                                                          "parts": {
                                                              "total": 1,
                                                              "hash": "8756311D78E90AC24C6CE56EFCCC0E911F8C6325"
                                                          }
                                                      },
                                                      "signature": {
                                                          "type": "ed25519",
                                                          "data": "5872EF50C1E0D2CCEFE6B2A3EE11FCCE5A0715A7BDF3666D7442BC9203E420F0382567210C356DA3FFCAFCB009AD7BE5E9DE0BF326E223A336433613B94CFC0C"
                                                      }
                                                  }
                                              }
                                          ],
                                          "header_validator_set": {
                                              "validators": [
                                                  {
                                                      "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                                      "pub_key": {
                                                          "type": "ed25519",
                                                          "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                                      },
                                                      "voting_power": 10,
                                                      "accum": 0
                                                  }
                                              ],
                                              "proposer": null
                                          },
                                          "next_header": {
                                              "chain_id": "test-chain-QV6awA",
                                              "height": 159,
                                              "time": "2018-04-11T07:51:51.894Z",
                                              "num_txs": 0,
                                              "last_block_id": {
                                                  "hash": "E74927D9E4EE86AF1913ABE78335E740D14AF6F3",
                                                  "parts": {
                                                      "total": 1,
                                                      "hash": "8756311D78E90AC24C6CE56EFCCC0E911F8C6325"
                                                  }
                                              },
                                              "total_txs": 1,
                                              "last_commit_hash": "B8DE6899847D0FF5226E158EFFDBA16E7B486873",
                                              "data_hash": "",
                                              "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                                              "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                                              "app_hash": "A710D7B6E6311DB396A19E0B30A6875CDEFCC335138B3D05395FAC4650F7F285",
                                              "last_results_hash": "585BD7ED566208944B1F2E13170CD4B66325B8EE",
                                              "evidence_hash": ""
                                          },
                                          "next_header_votes": [
                                              {
                                                  "pub_key": {
                                                      "type": "ed25519",
                                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                                  },
                                                  "vote": {
                                                      "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                                      "validator_index": 0,
                                                      "height": 159,
                                                      "round": 0,
                                                      "timestamp": "2018-04-11T07:51:51.904Z",
                                                      "type": 2,
                                                      "block_id": {
                                                          "hash": "8A747344917B0E25D256586A58BF00794967D3C0",
                                                          "parts": {
                                                              "total": 1,
                                                              "hash": "154A0928E86384155196E44237A06B36835B1C2B"
                                                          }
                                                      },
                                                      "signature": {
                                                          "type": "ed25519",
                                                          "data": "BBD27D314449384605D07E6DCF125C06FE8CD6F1E80FBDDA5567F358F4DDAC4AB2DE1FEED9BF28280DAC20CC30FA3EE33CBD2BACC5CD25FEE1FD0949C83B3D00"
                                                      }
                                                  }
                                              }
                                          ],
                                          "next_header_validator_set": {
                                              "validators": [
                                                  {
                                                      "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                                      "pub_key": {
                                                          "type": "ed25519",
                                                          "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                                      },
                                                      "voting_power": 10,
                                                      "accum": 0
                                                  }
                                              ],
                                              "proposer": null
                                          }
                                      }
                                  }
                              ],
                              "linkHash": "dc0f6ebd2b0d2eb78bbf37a9fea314529083ea4d6bddcd2e1f195a3d1b07d091"
                          }
                      },
                      "process": "one",
                      "linkHash": "dc0f6ebd2b0d2eb78bbf37a9fea314529083ea4d6bddcd2e1f195a3d1b07d091"
                  }
              ],
              "data": {
                  "agentVersion": "0.3.0-rc2",
                  "stateHash": "023c275a9843537d8cf41652765cbf40203f2dd9a51533bf4c3df81c795d4cf9"
              }
          },
          "signatures": []
      },
      "meta": {
          "evidences": [
              {
                  "backend": "TMPop",
                  "provider": "test-chain-QV6awA",
                  "proof": {
                      "block_height": 2924,
                      "merkle_root": "e77d69eae359950a73e191340b677165c12bc1c69f4190e2c85d3731f9f58f2b",
                      "merkle_path": [],
                      "validations_hash": "9711620370185b6b966eaba989205cb31158bad5b446e4926ae66ba5f97dcfd6",
                      "header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 2924,
                          "time": "2018-04-11T08:41:47.392Z",
                          "num_txs": 1,
                          "last_block_id": {
                              "hash": "2C3877943D88AFEF0A6C147F2F4EDBEC50CD5037",
                              "parts": {
                                  "total": 1,
                                  "hash": "2EEB494886F6F6C8F113EA94A037A266157018D8"
                              }
                          },
                          "total_txs": 3,
                          "last_commit_hash": "682F20E80237A22F6BE342BCFC6CDDB10ACFCA21",
                          "data_hash": "0DDDEF47232023C13D587562A9E980EEA78FB648",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "975CF8A0619BC948DC4C5A058570DDC0DC6CB73E4079467F3BB8C830C470DAE3",
                          "last_results_hash": "",
                          "evidence_hash": ""
                      },
                      "header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 2924,
                                  "round": 0,
                                  "timestamp": "2018-04-11T08:41:47.402Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "EBFD7497029A0650BA122B27D555121B2A555262",
                                      "parts": {
                                          "total": 1,
                                          "hash": "8C8992EE3046CFCC7E9A1D35F5A8B2BC33B1335D"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "BCDCA99B28D1DE38C860E97B4FD26DB8AF46BC2B80612F42DA2B3AA20C86F06D908FF1BE82370133DFF71A17D4432FEB55CBF239EA8F45801DFBC9AF19645C02"
                                  }
                              }
                          }
                      ],
                      "header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      },
                      "next_header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 2925,
                          "time": "2018-04-11T08:41:48.409Z",
                          "num_txs": 0,
                          "last_block_id": {
                              "hash": "EBFD7497029A0650BA122B27D555121B2A555262",
                              "parts": {
                                  "total": 1,
                                  "hash": "8C8992EE3046CFCC7E9A1D35F5A8B2BC33B1335D"
                              }
                          },
                          "total_txs": 3,
                          "last_commit_hash": "E02823C41DE90A4FE1C5B2065F34C1B03B2383AF",
                          "data_hash": "",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "41076C76E9827FDE84B4E5CC5F5021BAC36738B9C37614F850B43001B4DA07B5",
                          "last_results_hash": "585BD7ED566208944B1F2E13170CD4B66325B8EE",
                          "evidence_hash": ""
                      },
                      "next_header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 2925,
                                  "round": 0,
                                  "timestamp": "2018-04-11T08:41:48.423Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "E6EF569BA87F4922558CB7150D7538811F02D611",
                                      "parts": {
                                          "total": 1,
                                          "hash": "B846308A1C8C617F72B92F2EFAA3A8BEBDA0201A"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "8F1FE142283EB45CAB1887362ED209CFA99B54121DEA5F3C3409B95C4A9A120738EC8138C27150B4626B772EF49B0526319BF5680F0399B3EA71C6A6A0BB8007"
                                  }
                              }
                          }
                      ],
                      "next_header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      }
                  }
              }
          ],
          "linkHash": "e77d69eae359950a73e191340b677165c12bc1c69f4190e2c85d3731f9f58f2b",
          "agentUrl": "http://agent:3000",
          "segmentUrl": "http://agent:3000/two/segments/e77d69eae359950a73e191340b677165c12bc1c69f4190e2c85d3731f9f58f2b"
      }
  },
  {
      "link": {
          "state": {
              "author": "z",
              "body": "z"
          },
          "meta": {
              "mapId": "17a7719d-7970-41b3-a272-b5fe70c9ddeb",
              "process": "two",
              "action": "message",
              "type": "message",
              "inputs": [
                  "z",
                  "z"
              ],
              "tags": null,
              "priority": 0,
              "prevLinkHash": "db2f637f253ec4b00b06571d8e8ee6d9cfae7e5191400a8e9e64fedbe41c4c7e",
              "refs": [],
              "data": {
                  "agentVersion": "0.3.0-rc2",
                  "stateHash": "95e003faab679572485e706a0d08f3fbc015ef9315920db914157979cf1e5e64"
              }
          },
          "signatures": []
      },
      "meta": {
          "evidences": [
              {
                  "backend": "TMPop",
                  "provider": "test-chain-QV6awA",
                  "proof": {
                      "block_height": 4247,
                      "merkle_root": "f263f1938ff3c58aa3a6179a2919b30cf39de35821ca2ae560832464fdb0373e",
                      "merkle_path": [],
                      "validations_hash": "9711620370185b6b966eaba989205cb31158bad5b446e4926ae66ba5f97dcfd6",
                      "header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 4247,
                          "time": "2018-04-11T12:50:34.162Z",
                          "num_txs": 1,
                          "last_block_id": {
                              "hash": "6631899D6A8332538EF58F92ABAF007A21DD7C1F",
                              "parts": {
                                  "total": 1,
                                  "hash": "8E208731335F335AF740168BF2F4E6F9F5538410"
                              }
                          },
                          "total_txs": 6,
                          "last_commit_hash": "36820B262EEB7C2B181A5D5C442F08923F70618D",
                          "data_hash": "69215E3A56886432744C48090D27F2C13D4DE896",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "2BD065031DFA48B1710247AF0394BF81BFAA737460858DB33D712AAFBCBE38DB",
                          "last_results_hash": "",
                          "evidence_hash": ""
                      },
                      "header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 4247,
                                  "round": 0,
                                  "timestamp": "2018-04-11T12:50:34.173Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "4AA12C1FDD0898FCAEE40C4F7AC7E4D3A5E8D0E7",
                                      "parts": {
                                          "total": 1,
                                          "hash": "434662A5FC975FDBAD750592A4404277E96FB6A2"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "54F35F98EEEE1FFAD60CB6B7B8DD80226C4F5D2B23B07EF965755815E125EA8CEFA14E45DE7AE439E2653A0EA4B1296593B0545849AB058B9E8A5A4CD92EA002"
                                  }
                              }
                          }
                      ],
                      "header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      },
                      "next_header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 4248,
                          "time": "2018-04-11T12:50:35.18Z",
                          "num_txs": 0,
                          "last_block_id": {
                              "hash": "4AA12C1FDD0898FCAEE40C4F7AC7E4D3A5E8D0E7",
                              "parts": {
                                  "total": 1,
                                  "hash": "434662A5FC975FDBAD750592A4404277E96FB6A2"
                              }
                          },
                          "total_txs": 6,
                          "last_commit_hash": "E92BC631D9B4C7677C22FDA4DE8111F5FDBB29B0",
                          "data_hash": "",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "91D3E053DDBBB466DB38D432A87C0530809A98FBC8084E2A4CD0AE40D68AC036",
                          "last_results_hash": "585BD7ED566208944B1F2E13170CD4B66325B8EE",
                          "evidence_hash": ""
                      },
                      "next_header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 4248,
                                  "round": 0,
                                  "timestamp": "2018-04-11T12:50:35.19Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "F52E87957456238DDA7A7DFC19164104259243F4",
                                      "parts": {
                                          "total": 1,
                                          "hash": "4AD2DC84676B8ECC3CD6301758E54599086DD062"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "EDD228C56B16631DEE944F43622036E0C792E95C4E8088C8C11AF0500B353B4B7F2B8E8E439FF79E6A24708A61B09931F40CEBD28C81126885A13AB26BAA400D"
                                  }
                              }
                          }
                      ],
                      "next_header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      }
                  }
              }
          ],
          "linkHash": "f263f1938ff3c58aa3a6179a2919b30cf39de35821ca2ae560832464fdb0373e",
          "agentUrl": "http://agent:3000",
          "segmentUrl": "http://agent:3000/two/segments/f263f1938ff3c58aa3a6179a2919b30cf39de35821ca2ae560832464fdb0373e"
      }
  },
  {
      "link": {
          "state": {
              "title": "zer"
          },
          "meta": {
              "mapId": "17a7719d-7970-41b3-a272-b5fe70c9ddeb",
              "process": "two",
              "action": "init",
              "type": "init",
              "inputs": [
                  "zer"
              ],
              "tags": null,
              "priority": 0,
              "prevLinkHash": "",
              "refs": [],
              "data": {
                  "agentVersion": "0.3.0-rc2",
                  "stateHash": "b3770c0d01e4ebe92191225748c92c1a7ac7f2631a3fd4af548a8a810ab289fd"
              }
          },
          "signatures": []
      },
      "meta": {
          "evidences": [
              {
                  "backend": "TMPop",
                  "provider": "test-chain-QV6awA",
                  "proof": {
                      "block_height": 2900,
                      "merkle_root": "f356b213f1f11e6df31b444949a28bc35c37088a278d4f522be7a1c1cc4f1681",
                      "merkle_path": [],
                      "validations_hash": "9711620370185b6b966eaba989205cb31158bad5b446e4926ae66ba5f97dcfd6",
                      "header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 2900,
                          "time": "2018-04-11T08:41:22.966Z",
                          "num_txs": 1,
                          "last_block_id": {
                              "hash": "3C67596154E6A98579EBC4B37D4A002D48AB7A3F",
                              "parts": {
                                  "total": 1,
                                  "hash": "514BDF830D4972170E276DE259876D5CD93CE1CC"
                              }
                          },
                          "total_txs": 2,
                          "last_commit_hash": "F5CBE8CCA403301AD7419719123DD237F5A7465C",
                          "data_hash": "3EA0012757986046D6983D4351F4E4AA8A70D740",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "39B10815C00153F36A0ED4C5DBFA7282DB2FE2DCCC3177B0B836E11237759999",
                          "last_results_hash": "",
                          "evidence_hash": ""
                      },
                      "header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 2900,
                                  "round": 0,
                                  "timestamp": "2018-04-11T08:41:22.975Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "557D5D7A79D2E21588143D76B9114F6DE4DF056F",
                                      "parts": {
                                          "total": 1,
                                          "hash": "94BA2BDF6BBD40CA83F306F4D28B63F67CF27E25"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "E79CD34460E4DECECDC4763E4CD6BD3938AE5D0950728A3CF16DCA691502A65E66A5B82E737B182A1ED644901D744D37E367E581162A8BFA0500C7EDC5A41E02"
                                  }
                              }
                          }
                      ],
                      "header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      },
                      "next_header": {
                          "chain_id": "test-chain-QV6awA",
                          "height": 2901,
                          "time": "2018-04-11T08:41:23.984Z",
                          "num_txs": 0,
                          "last_block_id": {
                              "hash": "557D5D7A79D2E21588143D76B9114F6DE4DF056F",
                              "parts": {
                                  "total": 1,
                                  "hash": "94BA2BDF6BBD40CA83F306F4D28B63F67CF27E25"
                              }
                          },
                          "total_txs": 2,
                          "last_commit_hash": "E71399D6B36B13B4B0CA3834C5B67735BAD4856B",
                          "data_hash": "",
                          "validators_hash": "603BF3370094F2A350E7C249779F57CB44D6986C",
                          "consensus_hash": "0B8CEF95EC57AC2D96038FD0AE3901C14FAE8E73",
                          "app_hash": "CE21B74019C1A3C43B7D15BBB99F8FC5DAD1D421610D16431F3A5135638A895D",
                          "last_results_hash": "585BD7ED566208944B1F2E13170CD4B66325B8EE",
                          "evidence_hash": ""
                      },
                      "next_header_votes": [
                          {
                              "pub_key": {
                                  "type": "ed25519",
                                  "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                              },
                              "vote": {
                                  "validator_address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "validator_index": 0,
                                  "height": 2901,
                                  "round": 0,
                                  "timestamp": "2018-04-11T08:41:23.994Z",
                                  "type": 2,
                                  "block_id": {
                                      "hash": "2BA48EE2E8B9770131401CE9D3A04CC9DC0104A0",
                                      "parts": {
                                          "total": 1,
                                          "hash": "B90F52D1369C372269074782E30C3ED1EE93147E"
                                      }
                                  },
                                  "signature": {
                                      "type": "ed25519",
                                      "data": "5A9A3D74A15509A0D6A090E2C63737E043BFFCEC0B8B2554A97D0B987DA778366F0C6BD45235F59071D9EEF2C0F1B1EC732C990F24352D963493D504D7481C0F"
                                  }
                              }
                          }
                      ],
                      "next_header_validator_set": {
                          "validators": [
                              {
                                  "address": "057E0538B2C3095F2DA3EAEF077FCF17E77F6D79",
                                  "pub_key": {
                                      "type": "ed25519",
                                      "data": "5DB361B22858D2DCC3B8E043071063FF20D9DD0C8F7653F8147E14A6ECE1FA8C"
                                  },
                                  "voting_power": 10,
                                  "accum": 0
                              }
                          ],
                          "proposer": null
                      }
                  }
              }
          ],
          "linkHash": "f356b213f1f11e6df31b444949a28bc35c37088a278d4f522be7a1c1cc4f1681",
          "agentUrl": "http://agent:3000",
          "segmentUrl": "http://agent:3000/two/segments/f356b213f1f11e6df31b444949a28bc35c37088a278d4f522be7a1c1cc4f1681"
      }
  }
]`;

export default Controller.extend({
  cs: chainscript_raw
});
