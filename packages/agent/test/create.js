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

import should from 'should';

import create, { handleFossilizerEvent } from '../src/create';
import memoryStore from '../src/memoryStore';
import plugins from '../src/plugins';
import Process from '../src/process';
import actions from './utils/basicActions';

import fossilizerHttpClient from '../src/fossilizerHttpClient';
import storeHttpClient from '../src/storeHttpClient';
import {
  storeClientFactory,
  fossilizerClientFactory
} from '../src/clientFactory';
import { FOSSILIZER_DID_FOSSILIZE_LINK } from '../src/eventTypes';

const dummyFossilizer = {
  fossilize() {
    return Promise.resolve({ fossil: true });
  },

  getInfo() {
    return Promise.resolve({ name: 'dummy' });
  },

  connect() {},
  on() {}
};

describe('Agent', () => {
  let agent;

  beforeEach(() => {
    agent = create({ agentUrl: 'http://localhost' });
    storeClientFactory.clearAvailableClients();
    fossilizerClientFactory.clearAvailableClients();
  });

  afterEach(() => {
    delete actions.events;
  });

  describe('#getInfo', () => {
    it('returns a Promise resolving with each process information', () => {
      agent.addProcess('basic', actions, memoryStore(), null);
      agent.addProcess('basic2', actions, memoryStore(), null);
      return agent.getInfo().then(infos => {
        infos.processes.should.be.an.Object();
        Object.keys(infos.processes).length.should.be.exactly(2);
        Object.values(infos.processes)[0].should.be.an.Object();
        Object.values(infos.processes)[0].name.should.be.a.String();
      });
    });

    it('returns a Promise resolving with information about the existing fossilizers', () => {
      fossilizerClientFactory.create(
        fossilizerHttpClient,
        'http://fossilizer:6000'
      );

      return agent.getInfo().then(infos => {
        infos.fossilizers.should.be.an.Object();
        infos.fossilizers.length.should.be.exactly(1);
        infos.fossilizers[0].url.should.be.exactly('http://fossilizer:6000');
      });
    });

    it('returns a Promise resolving with information about the existing stores', () => {
      storeClientFactory.create(storeHttpClient, 'http://store:5000');

      return agent.getInfo().then(infos => {
        infos.stores.should.be.an.Object();
        infos.stores.length.should.be.exactly(1);
        infos.stores[0].url.should.be.exactly('http://store:5000');
      });
    });

    it('returns the list of indexed active plugins', () => {
      agent.addProcess('plugins1', actions, memoryStore(), null, {
        plugins: [plugins.stateHash, plugins.agentUrl('http://localhost:3000')]
      });
      agent.addProcess('plugins2', actions, memoryStore(), null, {
        plugins: [plugins.localTime]
      });

      return agent.getInfo().then(infos => {
        infos.plugins.should.be.an.Array();
        infos.plugins.length.should.be.exactly(3);
        infos.plugins[2].should.eql({
          id: '3',
          name: plugins.localTime.name,
          description: plugins.localTime.description
        });
      });
    });

    it('does not store duplicate plugin instances', () => {
      // Since plugins.stateHash doesn't take arguments, both processes will share the same first plugin
      agent.addProcess('plugins1', actions, memoryStore(), null, {
        plugins: [plugins.stateHash, plugins.agentUrl('http://localhost:3000')]
      });
      agent.addProcess('plugins2', actions, memoryStore(), null, {
        plugins: [plugins.stateHash, plugins.agentUrl('http://localhost:3001')]
      });

      return agent.getInfo().then(infos => {
        infos.plugins.should.be.an.Array();
        infos.plugins.length.should.be.exactly(3);
      });
    });
  });

  describe('#addProcess', () => {
    it('resolves with the newly created process', () => {
      const process = agent.addProcess('basic', actions, memoryStore(), null, {
        plugins: [plugins.stateHash, plugins.localTime]
      });
      process.name.should.be.exactly('basic');
      process.plugins.should.deepEqual([plugins.stateHash, plugins.localTime]);
      process.actions.should.deepEqual(actions);
    });

    it('can span multiple processes', () => {
      agent.addProcess('first', actions, memoryStore(), null);
      agent.addProcess('second', actions, memoryStore(), null);
      return agent
        .getAllProcesses()
        .then(processes => processes.length.should.be.exactly(2));
    });

    it('fails if process name already exists', () => {
      agent.addProcess('basic', actions, memoryStore(), null);
      try {
        agent.addProcess('basic', actions);
        throw new Error('should have failed');
      } catch (err) {
        err.message.should.be.exactly('already exists');
        err.status.should.be.exactly(400);
      }
    });

    it('fails if actions are undefined', () => {
      try {
        agent.addProcess('basic', undefined, memoryStore(), null);
        throw new Error('should have failed');
      } catch (err) {
        err.message.should.be.exactly('action functions are empty');
        err.status.should.be.exactly(400);
      }
    });

    it('fails if actions are empty', () => {
      try {
        agent.addProcess('basic', {}, memoryStore(), null);
        throw new Error('should have failed');
      } catch (err) {
        err.message.should.be.exactly('action functions are empty');
        err.status.should.be.exactly(400);
      }
    });

    it('calls the storeClient callbacks even if multiple processes are defined', () => {
      let callCount = 0;
      let foundSegments;
      actions.events = {
        SavedLinks() {
          callCount += 1;
        }
      };

      return agent
        .addProcess('first', actions, memoryStore(), null)
        .createMap(null, null, 1, 2, 3)
        .then(() =>
          agent
            .addProcess('second', actions, memoryStore(), null)
            .createMap(null, null, 'a', 'b', 'c')
        )
        .then(() => agent.findSegments('first'))
        .then(({ segments }) => {
          foundSegments = segments;
          return agent.findSegments('second');
        })
        .then(({ segments }) => {
          [...foundSegments, ...segments].length.should.be.exactly(2);
          callCount.should.be.exactly(2);
        });
    });

    it('calls the storeClient callbacks even if multiple processes are using the same store', () => {
      let callCount = 0;
      actions.events = {
        SavedLinks() {
          callCount += 1;
        }
      };
      const store = memoryStore();
      let foundSegments;

      return agent
        .addProcess('first', actions, store, null)
        .createMap(null, null, 1, 2, 3)
        .then(() =>
          agent
            .addProcess('second', actions, store, null)
            .createMap(null, null, 'a', 'b', 'c')
        )
        .then(() => agent.findSegments('first'))
        .then(({ segments }) => {
          foundSegments = segments;
          return agent.findSegments('second');
        })
        .then(({ segments }) => {
          [...foundSegments, ...segments].length.should.be.exactly(2);
          callCount.should.be.exactly(2);
        });
    });

    it('supports one or several fossilizers', () => {
      const p1 = agent.addProcess('first', actions, memoryStore(), null);
      should(p1.fossilizerClients).equal(null);

      const p2 = agent.addProcess(
        'second',
        actions,
        memoryStore(),
        dummyFossilizer
      );
      p2.fossilizerClients.should.deepEqual([dummyFossilizer]);

      const p3 = agent.addProcess('third', actions, memoryStore(), [
        dummyFossilizer,
        dummyFossilizer
      ]);
      p3.fossilizerClients.length.should.be.exactly(2);
    });
  });

  describe('#getProcess', () => {
    it('returns a Process', () => {
      agent.addProcess('basic', actions, memoryStore(), null);
      const p = agent.getProcess('basic');
      p.should.be.an.instanceOf(Process);
    });

    it('fails if trying to get a non-existent process', () => {
      agent.addProcess('basic', actions, memoryStore(), null);
      try {
        agent.getProcess('fake');
      } catch (err) {
        err.status.should.be.exactly(404);
        err.message.should.be.exactly("process 'fake' does not exist");
      }
    });
  });

  describe('#removeProcess', () => {
    it('removes an existing process', () => {
      agent.addProcess('first', actions, memoryStore(), null);
      return agent
        .getAllProcesses()
        .then(processes => {
          processes.length.should.be.exactly(1);
          return agent.removeProcess('first');
        })
        .then(p => p.length.should.be.exactly(0));
    });

    it('fails if trying to remove a non-existent process', () => {
      try {
        agent.removeProcess('first');
        throw new Error('should have failed');
      } catch (err) {
        err.message.should.be.exactly("process 'first' does not exist");
        err.status.should.be.exactly(404);
      }
    });
  });

  describe('#getAllProcesses', () => {
    it('returns every process created by the agent', () => {
      agent.addProcess('basic', actions, memoryStore(), null);
      agent.addProcess('basic2', actions, memoryStore(), null);
      return agent.getAllProcesses().then(processes => {
        processes.length.should.be.exactly(2);
        processes.forEach(p => p.name.should.be.oneOf(['basic', 'basic2']));
      });
    });

    it('should return only public fields of a process', () => {
      agent.addProcess('basic', actions, memoryStore(), dummyFossilizer, {
        plugins: [plugins.stateHash, plugins.agentUrl('http://localhost:3000')]
      });
      return agent.getAllProcesses().then(processes => {
        const infos = processes[0];
        infos.fossilizersInfo.should.be.an.Array();
        infos.fossilizersInfo.length.should.be.exactly(1);
        infos.fossilizersInfo[0].name.should.be.exactly('dummy');
        infos.storeInfo.should.be.an.Object();
        infos.storeInfo.adapter.name.should.be.exactly('memory');
        infos.processInfo.pluginsInfo.should.be.an.Array();
        infos.processInfo.pluginsInfo.length.should.be.exactly(2);
        infos.processInfo.pluginsInfo[0].should.eql({
          name: plugins.stateHash.name,
          description: plugins.stateHash.description
        });
      });
    });
  });

  describe('#findSegments', () => {
    it('finds segments matching a set of criterias on all processes', () => {
      const p1 = agent.addProcess('basic', actions, memoryStore(), null);
      const p2 = agent.addProcess('basic2', actions, memoryStore(), null);

      return p1
        .createMap(null, null, 1, 2, 3)
        .then(s1 => p1.createSegment(s1.meta.linkHash, 'action', [], [], 5))
        .then(() => agent.findSegments('basic'))
        .then(({ segments }) => segments.length.should.be.exactly(2))
        .then(() => p2.createMap(null, null, 4, 5, 6))
        .then(s1 => p2.createSegment(s1.meta.linkHash, 'action', [], [], 5))
        .then(() => agent.findSegments('basic2'))
        .then(({ segments }) => segments.length.should.be.exactly(2))
        .then(() => agent.findSegments('none'))
        .then(() => {
          throw new Error('Should have failed');
        })
        .catch(err => {
          err.message.should.be.exactly("process 'none' does not exist");
          err.status.should.be.exactly(404);
        });
    });

    it('finds the right amount of segments when using the same store for 2+ processes', () => {
      const store = memoryStore();
      return agent
        .addProcess('first', actions, store, null)
        .createMap(null, null, 1, 2, 3)
        .then(() =>
          agent
            .addProcess('second', actions, store, null)
            .createMap(null, null, 'a', 'b', 'c')
        )
        .then(() => agent.findSegments('first'))
        .then(({ segments }) => segments.length.should.be.exactly(1))
        .then(() => agent.findSegments('second'))
        .then(({ segments }) => segments.length.should.be.exactly(1));
    });

    it('only finds the segments of a given process when specified', () => {
      const store = memoryStore();
      return agent
        .addProcess('first', actions, store, null)
        .createMap(null, null, 1, 2, 3)
        .then(() =>
          agent
            .addProcess('second', actions, store, null)
            .createMap(null, null, 'a', 'b', 'c')
        )
        .then(() => agent.findSegments('second'))
        .then(({ segments }) => segments.length.should.be.exactly(1));
    });
  });

  describe('#getMapIds', () => {
    it('returns the map ids of a processes', () =>
      agent
        .addProcess('basic', actions, memoryStore(), null)
        .createMap(null, null, 1, 2, 3)
        .then(() =>
          agent
            .addProcess('basic2', actions, memoryStore(), null)
            .createMap(null, null, 'a', 'b', 'c')
        )
        .then(() => agent.getMapIds('basic'))
        .then(mapIds => {
          mapIds.length.should.be.exactly(1);
          mapIds[0].should.be.an.instanceOf(String);
        }));

    it('throw an error for a non-existent process', () =>
      agent
        .getMapIds('none')
        .then(() => new Error('should have failed'))
        .catch(err => err.status.should.be.exactly(404)));

    it('returns the good amount of map ids when using one store for multiple processes', () => {
      const store = memoryStore();
      return agent
        .addProcess('first', actions, store, null)
        .createMap(null, null, 1, 2, 3)
        .then(() =>
          agent
            .addProcess('second', actions, store, null)
            .createMap(null, null, 'a', 'b', 'c')
        )
        .then(() => agent.getMapIds('first'))
        .then(mapIds => {
          mapIds.length.should.be.exactly(1);
        });
    });
  });

  describe('#httpServer', () => {
    it('returns an instance of httpServer', () => {
      agent.addProcess('basic', actions, memoryStore(), null);
      return agent.httpServer();
    });
  });

  describe('#handleFossilizerEvent', () => {
    it('should save evidence when link fossilized', () => {
      const store = memoryStore();
      const process = agent.addProcess('basic', actions, store, null);

      const msg = {
        type: FOSSILIZER_DID_FOSSILIZE_LINK,
        data: {
          Evidence: 'yolo',
          Data: 'Z6x7OW+8Kl0tjQ==', // base64 encoded "67ac7b396fbc2a5d2d8d"
          Meta: 'YmFzaWM=' // base64 encoded "basic"
        }
      };
      const processes = { basic: process };

      const mockCalls = [];

      process.saveEvidence = (linkHash, evidence) =>
        mockCalls.push({ linkHash, evidence });

      handleFossilizerEvent(msg, processes);

      mockCalls.length.should.be.exactly(1);
      mockCalls[0].linkHash.should.equal('67ac7b396fbc2a5d2d8d');
      mockCalls[0].evidence.should.equal('yolo');
    });
  });
});
