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

import processify from '../src/processify';
import signatures from './utils/signatures';

describe('processify', () => {
  const actions = {
    events: {
      testEvent(arg) {
        (typeof arg).should.not.be.exactly('undefined');
        this.state.should.be.an.Object();
        this.meta.should.be.an.Object();
      }
    },
    add(data) {
      this.state.add = data;
      this.append();
    },
    tag() {
      this.meta.tags = ['tag'];
      this.append();
    },
    updateType() {
      this.append('new');
    },
    reject() {
      this.reject('error');
    }
  };

  const data = { message: 'test' };

  it('adds the default init function', done =>
    processify(actions)
      .init(data)
      .then(res => {
        res.state.should.eql(data);
        done();
      })
      .catch(done));

  it('returns the state in the result on function call', () =>
    processify(actions)
      .add(data)
      .then(res => res.state.add.should.eql(data)));

  it('keeps its state on successive function calls', () => {
    const mAgent = processify(actions);
    return mAgent
      .init(data)
      .then(() => mAgent.add())
      .then(res => res.state.message.should.eql('test'));
  });

  it('rejects the promise with the error message on reject', () => {
    const mAgent = processify(actions);
    return mAgent.reject().catch(res => res.message.should.eql('error'));
  });

  it('returns the tags in the result on function call', () => {
    const mAgent = processify(actions);
    return mAgent.tag().then(res => res.meta.tags.should.eql(['tag']));
  });

  it('adds event functions', () => {
    const mAgent = processify(actions);
    mAgent.events.should.be.an.Object();
    mAgent.events.testEvent.should.be.a.Function();
    mAgent.events.testEvent(true);
  });

  it('formats link.meta with refs', () => {
    const refs = [
      {
        process: 'test',
        linkHash: 'test'
      }
    ];
    const mAgent = processify(actions, null, null, refs);
    return mAgent.add('test').then(res => res.meta.refs.length.should.eql(1));
  });

  it('handle bad refs format', () => {
    const refs = {
      process: 'test',
      linkHash: 'test'
    };
    const mAgent = processify(actions, null, null, refs);
    return mAgent
      .reject()
      .catch(res => res.message.should.eql('Bad references type'));
  });

  it('handle bad refs format (missing property)', () => {
    const refs = [
      {
        linkHash: 'test'
      }
    ];
    const mAgent = processify(actions, null, null, refs);
    return mAgent
      .reject()
      .catch(res =>
        res.message.should.eql('missing segment or (process and linkHash)')
      );
  });

  it('formats link.meta with signatures', () => {
    const mAgent = processify(
      actions,
      null,
      signatures.getValidSignatures(),
      []
    );
    return mAgent.add('test').then(res => {
      res.signatures.length.should.eql(1);
      res.signatures[0].should.deepEqual(signatures.getValidSignatures()[0]);
    });
  });

  it('handle bad signatures format (missing property)', () => {
    const mAgent = processify(
      actions,
      null,
      signatures.getInvalidSignatures(),
      []
    );
    return mAgent
      .reject()
      .catch(res =>
        res.message.should.eql('missing type, public key, signature or payload')
      );
  });

  it('adds action, inputs and type to the link.meta', () =>
    processify(actions)
      .add('test')
      .then(s => {
        s.meta.action.should.be.exactly('add');
        s.meta.type.should.be.exactly('add');
        s.meta.inputs.should.deepEqual(['test']);
      }));

  it('allows an action to update the link type', () =>
    processify(actions)
      .updateType('test')
      .then(s => s.meta.type.should.be.exactly('new')));
});
