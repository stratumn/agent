/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

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

import sinon from 'sinon';
import create from '../src/create';
import memoryStore from '../src/memoryStore';
import hashJson from '../src/hashJson';
import { memoryStoreInfo } from './fixtures';
import actions from './utils/basicActions';
import refs from './utils/refs';
import signatures from './utils/signatures';

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
  let memStore;

  beforeEach(() => {
    memStore = memoryStore();
    process = create().addProcess('basic', actions, memStore, null, {
      plugins
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
      process.createMap(null, null, 1, 2, 3).then(segment => {
        segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        segment.link.meta.mapId.should.be.a.String();
        segment.link.meta.process.should.be.exactly('basic');
        segment.link.meta.action.should.be.exactly('init');
        segment.link.meta.type.should.be.exactly('init');
        segment.link.meta.inputs.should.deepEqual([1, 2, 3]);
        segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
      }));

    it('should call the #SavedLinks() event', () => {
      let callCount = 0;
      actions.events = {
        SavedLinks(l) {
          callCount += 1;
          l.state.should.deepEqual({
            a: 1,
            b: 2,
            c: 3
          });
        }
      };
      return process
        .createMap([], [], 1, 2, 3)
        .then(() => callCount.should.be.exactly(1));
    });

    it('resolves with appropriate references', () =>
      process
        .createMap([], refs.getValidRefs(process.name), 1, 2, 3)
        .then(segment => {
          segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
          segment.link.meta.mapId.should.be.a.String();
          segment.link.meta.refs.should.be.an.Array();
          segment.link.meta.refs.length.should.be.exactly(2);
          segment.link.meta.process.should.be.exactly('basic');
          segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
        }));

    it('throws on a bad reference', () =>
      process
        .createMap([], refs.getInvalidRefs(), 1, 2, 3)
        .then(() => {
          throw new Error('createMap should fail');
        })
        .catch(err => {
          err.message.should.be.exactly(
            'missing segment or (process and linkHash)'
          );
        }));

    it('resolves with the appropriate signatures', () =>
      process
        .createMap(signatures.getValidSignatures(), [], 1, 2, 3)
        .then(segment => {
          segment.link.signatures.should.deepEqual(
            signatures.getValidSignatures()
          );
        }));

    it('throws on a bad signature', () =>
      process
        .createMap(signatures.getInvalidSignatures(), [], 1, 2, 3)
        .then(() => {
          throw new Error('createMap should fail');
        })
        .catch(err => {
          err.message.should.be.exactly(
            'missing type, public key, signature or payload'
          );
        }));
  });

  describe('#createSegment()', () => {
    it('resolves with the new segment', () => {
      let sgmt1;
      return process
        .createMap([], [], 1, 2, 3)
        .then(segment1 => {
          sgmt1 = segment1;
          return process.createSegment(
            segment1.meta.linkHash,
            'action',
            [],
            [],
            4
          );
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
          segment2.link.meta.action.should.be.exactly('action');
          segment2.link.meta.type.should.be.exactly('action');
          segment2.link.meta.inputs.should.deepEqual([4]);
          segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
        });
    });

    it('resolves with good references', () => {
      let sgmt1;
      return process.createMap([], [], 1, 2, 3).then(segment1 => {
        sgmt1 = segment1;
        return process
          .createSegment(
            segment1.meta.linkHash,
            'action',
            [],
            refs.getValidRefs(process.name, segment1.meta.linkHash),
            4
          )
          .then(segment2 => {
            segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
            segment2.link.meta.prevLinkHash.should.be.exactly(
              sgmt1.meta.linkHash
            );
            segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
            segment2.link.meta.refs.should.be.an.Array();
            segment2.link.meta.refs.length.should.be.exactly(2);
          });
      });
    });

    it('checks loadSegment function with good references', () =>
      process.createMap([], [], 1, 2, 3).then(segment1 =>
        process
          .createSegment(
            segment1.meta.linkHash,
            'testLoadSegments',
            [],
            refs.getValidRefs(process.name, segment1.meta.linkHash)
          )
          .then(segment2 => {
            segment2.link.state.nbSeg.should.be.exactly(1);
            segment2.link.state.nbErr.should.be.exactly(1);
            segment2.link.state.nbNull.should.be.exactly(0);
          })
      ));

    it('should call the #SavedLinks() event', () =>
      process.createMap([], [], 1, 2, 3).then(segment1 => {
        let callCount = 0;
        actions.events = {
          SavedLinks(l) {
            callCount += 1;
            l.state.should.deepEqual({
              a: 1,
              b: 2,
              c: 3,
              d: 4
            });
          }
        };

        return process
          .createSegment(segment1.meta.linkHash, 'action', [], [], 4)
          .then(() => {
            callCount.should.be.exactly(1);
          });
      }));

    it('sets the evidence state appropriately', () =>
      process
        .createMap([], [], 1, 2, 3)
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
            [],
            2
          );
        })
        .then(segment3 => segment3.meta.evidences.should.deepEqual([])));
  });

  describe('#saveEvidence()', () => {
    it('resolves', () =>
      process.createMap([], [], 1, 2, 3).then(segment1 =>
        process.saveEvidence(segment1.meta.linkHash, {
          test: true
        })
      ));
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
        process.createMap([], [], 1, 2, 3),
        process.createMap([], [], 2, 2, 3)
      ])
        .then(() => process.findSegments())
        .then(({ segments }) => {
          segments.should.be.an.Array();
          segments.length.should.be.exactly(1);
          segments[0].link.state.a.should.be.exactly(1);
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
        .createMap([], [], 2, 2, 3)
        .then(() => process.findSegments())
        .then(({ segments }) => {
          segments.should.have.length(1);
        });
    });
  });

  it('calls store#findSegments twice', () => {
    let filtered = false;
    process.plugins = [
      {
        filterSegment() {
          if (!filtered) {
            filtered = true;
            return false;
          }
          return true;
        }
      }
    ];
    const findSegmentsSpy = sinon.spy(memStore, 'findSegments');
    const newMap = a => process.createMap([], [], a, null, null);
    return newMap(1)
      .then(newMap.bind(null, 2))
      .then(newMap.bind(null, 3))
      .then(newMap.bind(null, 4))
      .then(() => process.findSegments({ offset: 0, limit: 3 }))
      .then(({ segments, ...rest }) => {
        segments.map(({ link: { state: { a } } }) => a).length.should.equal(3);
        rest.should.be.deepEqual({ hasMore: true, offset: 4, totalCount: 4 });
        findSegmentsSpy.callCount.should.be.eql(2);
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
        .createMap([], [], 2, 2, 3)
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
