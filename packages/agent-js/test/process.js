/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import should from 'should';
import create from '../src/create';
import memoryStore from '../src/memoryStore';
import hashJson from '../src/hashJson';
import generateSecret from '../src/generateSecret';
import { memoryStoreInfo } from './fixtures';
import actions from './utils/basicActions';
import refs from './utils/refs';

const plugins = [
  {
    name: 'T',
    description: 'D'
  }
];

const processInfo = {
  actions: {
    init: {
      args: ['a', 'b', 'c']
    },
    action: {
      args: ['d']
    },
    testLoadSegments: {
      args: []
    }
  },
  pluginsInfo: [
    {
      name: 'T',
      description: 'D'
    }
  ]
};

// TODO: could be improved by using a dummy fossilizer.
describe('Process', () => {
  let process;

  beforeEach(() => {
    process = create().addProcess('basic', actions, memoryStore(), null, {
      plugins,
      salt: ''
    });
  });

  afterEach(() => {
    delete actions.events;
  });

  describe('#getInfo()', () => {
    it('resolves with the process info', () =>
      process.getInfo().then(info =>
        info.should.deepEqual({
          name: process.name,
          storeInfo: memoryStoreInfo,
          processInfo
        })
      ));

    it('resolves with the process infos with fossilizers', () => {
      process.fossilizerClients = [
        {
          getInfo() {
            return Promise.resolve({
              name: '1'
            });
          }
        },
        {
          getInfo() {
            return Promise.resolve({
              name: '2'
            });
          }
        }
      ];
      return process.getInfo().then(info =>
        info.should.deepEqual({
          name: process.name,
          storeInfo: memoryStoreInfo,
          processInfo,
          fossilizersInfo: [
            {
              name: '1'
            },
            {
              name: '2'
            }
          ]
        })
      );
    });
  });

  describe('#createMap()', () => {
    it('resolves with the first segment', () =>
      process.createMap(null, 1, 2, 3).then(segment => {
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        segment.link.meta.mapId.should.be.a.String();
        segment.link.meta.process.should.be.exactly('basic');
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
      }));

    it('should call the #didSave() event', () => {
      let callCount = 0;
      actions.events = {
        didSave(s) {
          callCount += 1;
          s.link.state.should.deepEqual({
            a: 1,
            b: 2,
            c: 3
          });
        }
      };
      return process
        .createMap([], 1, 2, 3)
        .then(() => callCount.should.be.exactly(1));
    });

    it('resolves with good references', () =>
      process
        .createMap(refs.getGoodRefs(process.name), 1, 2, 3)
        .then(segment => {
          segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
          segment.link.meta.mapId.should.be.a.String();
          segment.link.meta.refs.should.be.an.Array();
          segment.link.meta.refs.length.should.be.exactly(3);
          segment.link.meta.process.should.be.exactly('basic');
          segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        }));

    it('resolves with bad reference', () =>
      process
        .createMap(refs.getBadRefs(), 1, 2, 3)
        .then(() => {
          throw new Error('createMap should fail');
        })
        .catch(err => {
          err.message.should.be.exactly(
            'missing segment or (process and linkHash)'
          );
        }));
  });

  describe('#createSegment()', () => {
    it('resolves with the new segment', () => {
      let sgmt1;
      return process
        .createMap([], 1, 2, 3)
        .then(segment1 => {
          sgmt1 = segment1;
          return process.createSegment(segment1.meta.linkHash, 'action', [], 4);
        })
        .then(segment2 => {
          segment2.link.state.should.deepEqual({
            a: 1,
            b: 2,
            c: 3,
            d: 4
          });
          segment2.link.meta.prevLinkHash.should.be.exactly(
            sgmt1.meta.linkHash
          );
          segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
        });
    });

    it('resolves with good references', () => {
      let sgmt1;
      return process.createMap([], 1, 2, 3).then(segment1 => {
        sgmt1 = segment1;
        return process
          .createSegment(
            segment1.meta.linkHash,
            'action',
            refs.getGoodRefs(process.name, segment1.meta.linkHash),
            4
          )
          .then(segment2 => {
            segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
            segment2.link.meta.prevLinkHash.should.be.exactly(
              sgmt1.meta.linkHash
            );
            segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
            segment2.link.meta.refs.should.be.an.Array();
            segment2.link.meta.refs.length.should.be.exactly(3);
          });
      });
    });

    it('checks loadSegment function with good references', () =>
      process.createMap([], 1, 2, 3).then(segment1 =>
        process
          .createSegment(
            segment1.meta.linkHash,
            'testLoadSegments',
            refs.getGoodRefs(process.name, segment1.meta.linkHash)
          )
          .then(segment2 => {
            segment2.link.state.nbSeg.should.be.exactly(1);
            segment2.link.state.nbErr.should.be.exactly(2);
            segment2.link.state.nbNull.should.be.exactly(0);
          })
      ));

    it('should call the #didSave() event', () =>
      process.createMap([], 1, 2, 3).then(segment1 => {
        let callCount = 0;
        actions.events = {
          didSave(s) {
            callCount += 1;
            s.link.state.should.deepEqual({
              a: 1,
              b: 2,
              c: 3,
              d: 4
            });
          }
        };
        return process
          .createSegment(segment1.meta.linkHash, 'action', [], 4)
          .then(() => {
            callCount.should.be.exactly(1);
          });
      }));

    it('sets the evidence state appropriately', () =>
      process
        .createMap([], 1, 2, 3)
        .then(segment => {
          segment.meta.should.deepEqual({
            linkHash: segment.meta.linkHash,
            evidences: []
          });
          return segment;
        })
        .then(prevSegment => {
          // emulates a fossilizerClient
          process.fossilizerClients = [
            {
              fossilize() {
                return Promise.resolve(true);
              }
            }
          ];
          return process.createSegment(
            prevSegment.meta.linkHash,
            'action',
            [],
            2
          );
        })
        .then(segment3 => segment3.meta.evidences.should.deepEqual([])));
  });

  describe('#insertEvidence()', () => {
    it('resolves with the updated segment', () => {
      process.fossilizerClients = [
        {
          fossilize() {
            return Promise.resolve(true);
          }
        }
      ];
      return process.createMap([], 1, 2, 3).then(segment1 => {
        const secret = generateSecret(segment1.meta.linkHash, '');
        process.pendingEvidences[segment1.meta.linkHash] = 1;
        return process
          .insertEvidence(
            segment1.meta.linkHash,
            {
              test: true
            },
            secret
          )
          .then(segment2 => {
            segment2.link.state.should.deepEqual({
              a: 1,
              b: 2,
              c: 3
            });
            segment2.link.meta.mapId.should.be.a.String();
            segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
            segment2.meta.evidences.should.deepEqual([
              {
                test: true
              }
            ]);
            return should(
              process.pendingEvidences[segment1.meta.linkHash]
            ).equal(undefined);
          });
      });
    });

    it('fails if the secret is incorrect', () =>
      process
        .createMap([], 1, 2, 3)
        .then(segment1 =>
          process.insertEvidence(
            segment1.meta.linkHash,
            {
              test: true
            },
            'wrong secret'
          )
        )
        .then(() => {
          throw new Error('should have failed');
        })
        .catch(err => {
          err.message.should.be.exactly('unauthorized');
          err.status.should.be.exactly(401);
        }));

    it('fails if evidence is unexpected', () =>
      process
        .createMap([], 1, 2, 3)
        .then(segment1 => {
          const secret = generateSecret(segment1.meta.linkHash, '');
          return process.insertEvidence(
            segment1.meta.linkHash,
            {
              test: true
            },
            secret
          );
        })
        .then(() => {
          throw new Error('should have failed');
        })
        .catch(err => {
          err.message.should.be.exactly('trying to add an unexpected evidence');
          err.status.should.be.exactly(400);
        }));

    it('should call the #didFossilize() event', () => {
      process.fossilizerClients = [
        {
          fossilize() {
            return Promise.resolve(true);
          }
        }
      ];
      return process.createMap([], 1, 2, 3).then(segment => {
        let callCount = 0;
        actions.events = {
          didFossilize(s) {
            callCount += 1;
            s.meta.evidences.should.deepEqual([
              {
                test: true
              },
              {
                test2: true
              }
            ]);
            this.state.should.deepEqual({
              a: 1,
              b: 2,
              c: 3
            });
          }
        };
        const secret = generateSecret(segment.meta.linkHash, '');
        process.pendingEvidences[segment.meta.linkHash] = 2;
        return process
          .insertEvidence(
            segment.meta.linkHash,
            {
              test: true
            },
            secret
          )
          .then(() => callCount.should.be.exactly(0))
          .then(() =>
            process
              .insertEvidence(
                segment.meta.linkHash,
                {
                  test2: true
                },
                secret
              )
              .then(() => callCount.should.be.exactly(1))
          );
      });
    });
  });

  describe('#findSegments()', () => {
    it('applies the filters', () => {
      process.plugins = [
        {
          filterSegment(segment) {
            return segment.link.state.a === 1;
          }
        }
      ];
      return Promise.all([
        process.createMap([], 1, 2, 3),
        process.createMap([], 2, 2, 3)
      ])
        .then(() => process.findSegments())
        .then(body => {
          body.should.be.an.Array();
          body.length.should.be.exactly(1);
          body[0].link.state.a.should.be.exactly(1);
        });
    });

    it('applies the filters sequentially', () => {
      process.plugins = [
        {
          filterSegment(segment) {
            return segment.link.state.filtered === 1;
          }
        },
        {
          filterSegment(segment) {
            segment.link.state.filtered = 1;
            return true;
          }
        }
      ];

      return process
        .createMap([], 2, 2, 3)
        .then(() => process.findSegments())
        .then(body => {
          body.should.have.length(1);
        });
    });
  });

  describe('#getSegment()', () => {
    it('applies the filters', () => {
      process.plugins = [
        {
          filterSegment(segment) {
            return segment.link.state.a === 1;
          }
        }
      ];

      return process
        .createMap([], 2, 2, 3)
        .then(s => process.getSegment(s.meta.linkHash))
        .then(() => {
          throw new Error('should not resolve');
        })
        .catch(err => {
          err.status.should.be.exactly(403);
          err.message.should.be.exactly('forbidden');
        });
    });
  });

  describe('#extractFilters()', () => {
    it('returns the defined filterSegment functions', () => {
      process.plugins.push({
        filterSegment() {
          return true;
        }
      });

      const filtered = process.extractFilters(plugins);
      filtered.should.containEql(plugins[1].filterSegment.bind(plugins[1]));
      filtered.should.have.length(1);
    });
  });
});
