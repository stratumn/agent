/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
  init(a, b, c) { this.append({ a, b, c }); },
  action(d) { this.state.d = d; this.append(); }
};

// TODO: could be improved by using a dummy fossilizer.
describe('Agent', () => {
  let agent;

  beforeEach(() => {
    agent = create(actions, memoryStore(), null, { plugins });
  });
  afterEach(() => {
    delete actions.events;
  });

  describe('#getInfo()', () => {
    it('resolves with the agent info', () =>
      agent
        .getInfo()
        .then(info => info.should.deepEqual({
          storeInfo: memoryStoreInfo,
          agentInfo: {
            actions: {
              init: { args: ['a', 'b', 'c'] },
              action: { args: ['d'] }
            },
            pluginsInfo: [{
              name: 'T',
              description: 'D'
            }]
          }
        }))
    );
  });

  describe('#createMap()', () => {
    it('resolves with the first segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment => {
          segment.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
          segment.link.meta.mapId.should.be.a.String();
          segment.meta.linkHash.should.be.exactly(hashJson(segment.link));
          segment.meta.evidence.should.deepEqual({ state: 'DISABLED' });
        })
    );

    it('should call the #didSave() event', () => {
      let callCount = 0;
      actions.events = {
        didSave(s) {
          callCount++;
          s.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
        }
      };
      return agent
        .createMap(1, 2, 3)
        .then(() => {
          callCount.should.be.exactly(1);
        });
    });
  });

  describe('#createSegment()', () => {
    it('resolves with the new segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 => (
          agent
            .createSegment(segment1.meta.linkHash, 'action', 4)
            .then(segment2 => {
              segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
              segment2.link.meta.prevLinkHash.should.be.exactly(segment1.meta.linkHash);
              segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
              segment2.meta.evidence.should.deepEqual({ state: 'DISABLED' });
            })
        )
      )
    );

    it('should call the #didSave() event', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 => {
          let callCount = 0;
          actions.events = {
            didSave(s) {
              callCount++;
              s.link.state.should.deepEqual({ a: 1, b: 2, c: 3, d: 4 });
            }
          };
          return agent
            .createSegment(segment1.meta.linkHash, 'action', 4)
            .then(() => {
              callCount.should.be.exactly(1);
            });
        })
    );
  });

  describe('#insertEvidence()', () => {
    it('resolves with the updated segment', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 => {
          const secret = generateSecret(segment1.meta.linkHash, '');
          return agent
            .insertEvidence(segment1.meta.linkHash, { test: true }, secret)
            .then(segment2 => {
              segment2.link.state.should.deepEqual({ a: 1, b: 2, c: 3 });
              segment2.link.meta.mapId.should.be.a.String();
              segment2.meta.linkHash.should.be.exactly(hashJson(segment2.link));
              segment2.meta.evidence.should.deepEqual({ state: 'COMPLETE', test: true });
            });
        })
    );

    it('fails if the secret is incorrect', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment1 =>
          agent
            .insertEvidence(segment1.meta.linkHash, { test: true }, 'wrong secret')
            .then(() => { throw new Error('should have failed'); })
            .catch(err => {
              err.message.should.be.exactly('unauthorized');
              err.status.should.be.exactly(401);
            })
        )
    );

    it('should call the #didFossilize() event', () =>
      agent
        .createMap(1, 2, 3)
        .then(segment => {
          let callCount = 0;
          actions.events = {
            didFossilize(s) {
              callCount++;
              s.meta.evidence.should.deepEqual({ state: 'COMPLETE', test: true });
              this.state.should.deepEqual({ a: 1, b: 2, c: 3 });
            }
          };
          const secret = generateSecret(segment.meta.linkHash, '');
          return agent
            .insertEvidence(segment.meta.linkHash, { test: true }, secret)
            .then(() => {
              callCount.should.be.exactly(1);
            });
        })
    );
  });
});
