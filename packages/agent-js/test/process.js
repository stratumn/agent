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

import create from '../src/create';
import memoryStore from '../src/memoryStore';
import hashJson from '../src/hashJson';
import generateSecret from '../src/generateSecret';
import { memoryStoreInfo } from './fixtures';

const plugins = [
  {
    name: 'T',
    description: 'D'
  }
];

const actions = {
  init(a, b, c) {
    this.append({ a, b, c });
  },
  action(d) {
    this.state.d = d;
    this.append();
  }
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
          processInfo: {
            actions: {
              init: { args: ['a', 'b', 'c'] },
              action: { args: ['d'] }
            },
            pluginsInfo: [
              {
                name: 'T',
                description: 'D'
              }
            ]
          }
        })
      ));
  });

  describe('#createMap()', () => {
    it('resolves with the first segment', () =>
      process.createMap(1, 2, 3).then(segment => {
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
          s.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        }
      };
      return process
        .createMap(1, 2, 3)
        .then(() => callCount.should.be.exactly(1));
    });
  });

  describe('#createSegment()', () => {
    it('resolves with the new segment', () => {
      let sgmt1;
      return process
        .createMap(1, 2, 3)
        .then(segment1 => {
          sgmt1 = segment1;
          return process.createSegment(segment1.meta.linkHash, 'action', 4);
        })
        .then(segment2 => {
          segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
          segment2.link.meta.prevLinkHash.should.be.exactly(
            sgmt1.meta.linkHash
          );
          segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
        });
    });

    it('should call the #didSave() event', () =>
      process.createMap(1, 2, 3).then(segment1 => {
        let callCount = 0;
        actions.events = {
          didSave(s) {
            callCount += 1;
            s.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
          }
        };
        return process
          .createSegment(segment1.meta.linkHash, 'action', 4)
          .then(() => {
            callCount.should.be.exactly(1);
          });
      }));

    it('sets the evidence state appropriately', () =>
      process
        .createMap(1, 2, 3)
        .then(segment => {
          segment.meta.should.deepEqual({ linkHash: segment.meta.linkHash });
          return segment;
        })
        .then(prevSegment => {
          // emulates a fossilizerClient
          process.fossilizerClient = {
            fossilize() {
              return Promise.resolve(true);
            }
          };
          return process.createSegment(prevSegment.meta.linkHash, 'action', 2);
        })
        .then(segment3 =>
          segment3.meta.evidence.state.should.deepEqual('QUEUED')
        ));
  });

  describe('#insertEvidence()', () => {
    it('resolves with the updated segment', () => {
      process.fossilizerClient = {
        fossilize() {
          return Promise.resolve(true);
        }
      };
      return process.createMap(1, 2, 3).then(segment1 => {
        const secret = generateSecret(segment1.meta.linkHash, '');
        return process
          .insertEvidence(segment1.meta.linkHash, { test: true }, secret)
          .then(segment2 => {
            segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
            segment2.link.meta.mapId.should.be.a.String();
            segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
            segment2.meta.evidence.should.deepEqual({
              state: 'COMPLETE',
              test: true
            });
          });
      });
    });

    it('fails if the secret is incorrect', () =>
      process
        .createMap(1, 2, 3)
        .then(segment1 =>
          process.insertEvidence(
            segment1.meta.linkHash,
            { test: true },
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

    it('should call the #didFossilize() event', () => {
      process.fossilizerClient = {
        fossilize() {
          return Promise.resolve(true);
        }
      };
      return process.createMap(1, 2, 3).then(segment => {
        let callCount = 0;
        actions.events = {
          didFossilize(s) {
            callCount += 1;
            s.meta.evidence.should.deepEqual({ state: 'COMPLETE', test: true });
            this.state.should.deepEqual({ a: 1, b: 2, c: 3 });
          }
        };
        const secret = generateSecret(segment.meta.linkHash, '');
        return process
          .insertEvidence(segment.meta.linkHash, { test: true }, secret)
          .then(() => {
            callCount.should.be.exactly(1);
          })
          .catch(err => console.log(err));
      });
    });
  });
});
