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

import processify from '../src/processify';

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
    reject() {
      this.reject('error');
    }
  };

  const data = { message: 'test' };

  it('adds the default init function', done => {
    processify(actions)
      .init(data)
      .then(res => {
        res.state.should.eql(data);
        done();
      })
      .catch(done);
  });

  it('returns the state in the result on function call', () => {
    processify(actions)
      .add(data)
      .then(res => res.state.add.should.eql(data));
  });

  it('keeps its state on successive function calls', () => {
    const mAgent = processify(actions);
    mAgent
      .init(data)
      .then(() => mAgent.add())
      .then(res => res.state.message.should.eql('test'));
  });

  it('rejects the promise with the error message on reject', () => {
    const mAgent = processify(actions);
    mAgent.reject().catch(res => res.message.should.eql('error'));
  });

  it('returns the tags in the result on function call', () => {
    const mAgent = processify(actions);
    mAgent.tag().then(res => res.meta.tags.should.eql(['tag']));
  });

  it('adds event functions', () => {
    const mAgent = processify(actions);
    mAgent.events.should.be.an.Object();
    mAgent.events.testEvent.should.be.a.Function();
    mAgent.events.testEvent(true);
  });
});
