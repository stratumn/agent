/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import getAgent from '../src/getAgent';
import agentHttpServer from './utils/agentHttpServer';

describe('#segmentify', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  let agent;
  beforeEach(() =>
    getAgent('http://localhost:3333').then(res => { agent = res; })
  );

  it('adds actions to the segment', () =>
    agent
      .createMap('hi there')
      .then(segment1 =>
        segment1
          .addMessage('hello', 'me')
          .then(segment2 => {
            segment2.link.meta.prevLinkHash.should.be.exactly(segment1.meta.linkHash);
            segment2.link.state.messages.should.deepEqual([{ message: 'hello', author: 'me' }]);
          })
      )
  );

  it('handles actions errors', () =>
    agent
      .createMap('hi there')
      .then(segment1 =>
        segment1
          .addMessage('hello')
          .then(() => {
            throw new Error('should not resolve');
          })
          .catch(err => {
            err.status.should.be.exactly(400);
            err.message.should.be.exactly('an author is required');
          })
      )
  );

  it('adds a #getPrev() method to the segment', () =>
    agent
      .createMap('hi there')
      .then(segment1 =>
        segment1
          .addMessage('hello', 'me')
          .then(segment2 => segment2.getPrev())
          .then(segment3 => {
            segment3.link.should.deepEqual(segment1.link);
            segment3.meta.should.deepEqual(segment1.meta);
            return segment3.getPrev();
          })
          .then(segment4 => {
            (segment4 === null).should.be.exactly(true);
          })
      )
  );

  // Deprecated
  it('adds a #load() method to the segment', () =>
    agent
      .createMap('hi there')
      .then(segment1 =>
        segment1
          .load()
          .then(segment2 => {
            segment2.link.should.deepEqual(segment1.link);
            segment2.meta.should.deepEqual(segment1.meta);
          })
      )
  );

  // Deprecated
  it('adds a #getBranches() method to the segment', () =>
    agent
      .createMap('hi there')
      .then(segment =>
        Promise
          .all([segment.addMessage('message one', 'me'), segment.addMessage('message two', 'me')])
          .then(() => segment.getBranches())
          .then(segments => {
            segments.length.should.be.exactly(2);
            segments[0].link.meta.prevLinkHash.should.be.exactly(segment.meta.linkHash);
            segments[1].link.meta.prevLinkHash.should.be.exactly(segment.meta.linkHash);
          })
      )
  );

});
