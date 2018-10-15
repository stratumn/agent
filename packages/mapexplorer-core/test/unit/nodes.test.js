/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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
import { memoryStore, create } from '@stratumn/agent';
import { findExtraLinks, findExtraNodes, loadRef } from '../../src/nodes';
import parseChainscript from '../../src/parseChainscript';
import validMapWithRefs from '../fixtures/fullMapWithRefs.json';
import referenceMap from '../fixtures/referenceMap.json';

describe('Nodes', () => {
  let root;
  let agentUrl;
  let commonStore;
  let agent;
  let insertSegments;

  beforeEach(() => {
    const mapCopy = JSON.parse(JSON.stringify(validMapWithRefs));
    root = parseChainscript(mapCopy);

    agentUrl = 'http://localhost:3000';
    agent = create({ agentUrl });
    commonStore = memoryStore();
    insertSegments = Promise.all(
      validMapWithRefs
        .concat(referenceMap)
        .map(s => commonStore.createLink(s.link))
    );
    agent.addProcess('a', { 0: 0 }, commonStore, null);
    agent.addProcess('z', { 0: 0 }, commonStore, null);
    agent.addProcess('e', { 0: 0 }, commonStore, null);
  });

  afterEach(() => {});

  describe('findExtraLinks', () => {
    it('finds reference links base on stratified chainscript', () =>
      insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          extraLinks.length.should.be.exactly(5);
          extraLinks[0].ref.should.be.exactly(true);
          extraLinks[0].source.data.link.meta.mapId.should.not.be.null();
        })
      ));

    it('fetches links from the store', () =>
      insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          extraLinks
            .map(l => l.source.data.link.state)
            .filter(Boolean)
            .length.should.be.exactly(extraLinks.length);
        })
      ));

    it('adds references without the agent', () =>
      insertSegments.then(() =>
        findExtraLinks(root, null).then(extraLinks => {
          extraLinks.length.should.be.exactly(5);
          extraLinks
            .map(l => l.source.data.link.state)
            .filter(Boolean)
            .length.should.be.exactly(2);
        })
      ));

    it('does not take doublons into account', () => {
      const extraRef = {
        process: 'z',
        mapId: 'ddde0416-c772-478c-b64f-4a095f5de11b',
        linkHash:
          '6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c'
      };
      root.data.link.meta.refs = [extraRef, extraRef];
      return insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          extraLinks.length.should.be.exactly(6);
          delete root.data.link.meta.refs;
        })
      );
    });

    it('returns an empty list if root node is null', () =>
      insertSegments.then(() =>
        findExtraLinks(null, agent).then(extraLinks => {
          extraLinks.length.should.be.exactly(0);
        })
      ));

    it('returns an error if a reference is incomplete', () => {
      const extraRef = {
        linkHash: 'test'
      };
      root.data.link.meta.refs = [extraRef];
      return insertSegments.then(() => {
        try {
          findExtraLinks(root, agent).then(() => {
            throw new Error('should have failed');
          });
        } catch (err) {
          err.message.should.be.exactly(
            `findExtraLinks: wrong reference format for linkHash '${extraRef.linkHash}' (should have process, linkHash)`
          );
          delete root.data.link.meta.refs;
        }
      });
    });

    it('returns an error if a referenced linkHash does not exist', () => {
      const extraRef = {
        linkHash: 'test',
        process: 'z'
      };
      root.data.link.meta.refs = [extraRef];
      return insertSegments.then(() =>
        findExtraLinks(root, agent)
          .then(() => {
            throw new Error('should have failed');
          })
          .catch(err => {
            err.message.should.be.exactly('not found');
            delete root.data.link.meta.refs;
          })
      );
    });

    it('returns an error if a referenced process does not exist', () => {
      const extraRef = {
        linkHash: 'test',
        process: 'test'
      };
      root.data.link.meta.refs = [extraRef];
      return insertSegments.then(() => {
        try {
          findExtraLinks(root, agent).then(() => {
            throw new Error('should have failed');
          });
        } catch (err) {
          err.message.should.be.exactly("process 'test' does not exist");
          delete root.data.link.meta.refs;
        }
      });
    });
  });

  describe('findExtraNodes', () => {
    it('finds referenced nodes from a list of links', () =>
      insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          const links = root.links().concat(extraLinks);
          const extraNodes = findExtraNodes(links, root.descendants());
          extraNodes.length.should.be.exactly(2);
        })
      ));

    it('does not take doublons into account', () => {
      const extraRef = {
        process: 'z',
        mapId: 'ddde0416-c772-478c-b64f-4a095f5de11b',
        linkHash:
          '6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c'
      };
      root.data.link.meta.refs = [extraRef, extraRef];
      return insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          const links = root.links().concat(extraLinks);
          const extraNodes = findExtraNodes(links, root.descendants());
          extraNodes.length.should.be.exactly(2);
          delete root.data.link.meta.refs;
        })
      );
    });

    it('returns an empty list if parameters are empty', () => {
      const extraNodes = findExtraNodes([], []);
      extraNodes.length.should.be.exactly(0);
    });
  });

  describe('loadRef', () => {
    it('correctly fetches the reference map', () =>
      insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          const links = root.links().concat(extraLinks);
          const extraNodes = findExtraNodes(links, root.descendants());
          return loadRef(agent, extraNodes[0], links).then(cs => {
            cs.length.should.be.exactly(7);
            const newRoot = cs.find(
              s =>
                s.meta.linkHash ===
                '6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c'
            );
            newRoot.should.not.be.null();
            cs
              .filter(s => s.parentRef === newRoot.meta.linkHash)
              .length.should.be.exactly(2);
          });
        })
      ));

    it('correctly merges the fetched map with the current references', () =>
      insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          const links = root.links().concat(extraLinks);
          const extraNodes = findExtraNodes(links, root.descendants());
          return loadRef(agent, extraNodes[0], links).then(cs => {
            const childRef = cs.filter(s => s.parentRef != null);
            childRef.length.should.be.exactly(2);
            childRef.map(r =>
              r.parentRef.should.be.exactly(
                '6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c'
              )
            );
            childRef.map(r => should(r.link.meta.refs).be.null());
          });
        })
      ));

    it('throws an error if the process does not exist', () =>
      insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          const links = root.links().concat(extraLinks);
          const extraNodes = findExtraNodes(links, root.descendants());
          extraNodes[0].data.link.meta.process = 'test';
          return loadRef(agent, extraNodes[0], links)
            .then(() => {
              throw new Error('Should have failed');
            })
            .catch(err =>
              err.message.should.be.exactly(
                `process '${extraNodes[0].data.link.meta.process}' not found`
              )
            );
        })
      ));

    it('throws an error if the map does not exist', () =>
      insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          const links = root.links().concat(extraLinks);
          const extraNodes = findExtraNodes(links, root.descendants());
          extraNodes[0].data.link.meta.mapId = 'test';
          return loadRef(agent, extraNodes[0], links)
            .then(() => {
              throw new Error('Should have failed');
            })
            .catch(err =>
              err.message.should.be.exactly('loadRef: no segments for map test')
            );
        })
      ));

    it('throws an error if the agent url is unknown', () => {
      try {
        loadRef(null, null, null);
      } catch (err) {
        err.message.should.be.exactly(
          'loadRef: unknown agent url or reference mapID'
        );
        return;
      }
      throw new Error('should have failed');
    });

    it('throws an error if the mapID is unknown', () =>
      insertSegments.then(() =>
        findExtraLinks(root, agent).then(extraLinks => {
          const links = root.links().concat(extraLinks);
          const extraNodes = findExtraNodes(links, root.descendants());
          delete extraNodes[0].data.link.meta.mapId;
          try {
            loadRef(null, null, null);
          } catch (err) {
            err.message.should.be.exactly(
              'loadRef: unknown agent url or reference mapID'
            );
            return;
          }
          throw new Error('should have failed');
        })
      ));
  });
});
