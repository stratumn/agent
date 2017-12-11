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
import { memoryStore, create } from 'stratumn-agent';
import { findExtraLinks, findExtraNodes, loadRef } from '../../src/nodes';
import parseChainscript from '../../src/parseChainscript';
import validMapWithRefs from '../fixtures/fullMapWithRefs.json';
import referenceMap from '../fixtures/referenceMap.json';

describe('Nodes', () => {
  let root;

  beforeEach(() => {
    const mapCopy = JSON.parse(JSON.stringify(validMapWithRefs));
    root = parseChainscript(mapCopy);
  });

  describe('findExtraLinks', () => {
    it('finds reference links base on stratified chainscript', () => {
      const extraLinks = findExtraLinks(root);
      extraLinks.length.should.be.exactly(5);
      extraLinks[0].ref.should.be.exactly(true);
      extraLinks[0].source.data.link.meta.mapId.should.not.be.null();
    });

    it('does not take doublons into account', () => {
      const extraRef = {
        process: 'z',
        mapId: 'ddde0416-c772-478c-b64f-4a095f5de11b',
        linkHash:
          '6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c'
      };
      root.data.link.meta.refs = [extraRef, extraRef];
      const extraLinks = findExtraLinks(root);
      extraLinks.length.should.be.exactly(6);
      delete root.data.link.meta.refs;
    });

    it('returns an empty list if root node is null', () => {
      const extraLinks = findExtraLinks(null);
      extraLinks.length.should.be.exactly(0);
    });

    it('returns an error if a reference is incomplete', () => {
      const extraRef = {
        process: 'z',
        linkHash: 'test'
      };
      root.data.link.meta.refs = [extraRef];
      try {
        findExtraLinks(root);
      } catch (err) {
        err.message.should.be.exactly(
          `findExtraLinks: wrong reference format for linkHash '${extraRef.linkHash}' (should have process, mapId, linkHash)`
        );
        delete root.data.link.meta.refs;
        return;
      }
      throw new Error('should have failed');
    });
  });

  describe('findExtraNodes', () => {
    it('finds referenced nodes from a list of links', () => {
      const links = root.links().concat(findExtraLinks(root));
      const extraNodes = findExtraNodes(links, root.descendants());
      extraNodes.length.should.be.exactly(2);
    });

    it('does not take doublons into account', () => {
      const extraRef = {
        process: 'z',
        mapId: 'ddde0416-c772-478c-b64f-4a095f5de11b',
        linkHash:
          '6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c'
      };
      root.data.link.meta.refs = [extraRef, extraRef];
      const links = root.links().concat(findExtraLinks(root));
      const extraNodes = findExtraNodes(links, root.descendants());
      extraNodes.length.should.be.exactly(2);
      delete root.data.link.meta.refs;
    });

    it('returns an empty list if parameters are empty', () => {
      const extraNodes = findExtraNodes([], []);
      extraNodes.length.should.be.exactly(0);
    });
  });

  describe('loadRef', () => {
    let agentUrl;
    let commonStore;
    let agent;
    let insertSegments;

    beforeEach(() => {
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

    it('correctly fetches the reference map', () => {
      const links = root.links().concat(findExtraLinks(root));
      const extraNodes = findExtraNodes(links, root.descendants());
      return insertSegments.then(() =>
        loadRef(agent, extraNodes[0], links).then(cs => {
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
        })
      );
    });

    it('correctly merges the fetched map with the current references', () => {
      const links = root.links().concat(findExtraLinks(root));
      const extraNodes = findExtraNodes(links, root.descendants());
      return insertSegments.then(() =>
        loadRef(agent, extraNodes[0], links).then(cs => {
          const childRef = cs.filter(s => s.parentRef != null);
          childRef.length.should.be.exactly(2);
          childRef.map(r =>
            r.parentRef.should.be.exactly(
              '6ae53b2cac86ef0a5b959e929c155237f6ee6e965bb7d7598cc25a00288de56c'
            )
          );
          childRef.map(r => should(r.link.meta.refs).be.null());
        })
      );
    });

    it('throws an error if the process does not exist', () => {
      const links = root.links().concat(findExtraLinks(root));
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
    });

    it('throws an error if the map does not exist', () => {
      const links = root.links().concat(findExtraLinks(root));
      const extraNodes = findExtraNodes(links, root.descendants());
      extraNodes[0].data.link.meta.mapId = 'test';
      return loadRef(agent, extraNodes[0], links)
        .then(() => {
          throw new Error('Should have failed');
        })
        .catch(err =>
          err.message.should.be.exactly('loadRef: no segments for map test')
        );
    });

    it('throws an error if the agent url is unknown', () => {
      try {
        loadRef(null, null, null);
      } catch (err) {
        err.message.should.be.exactly('loadRef: unknown agent url');
        return;
      }
      throw new Error('should have failed');
    });
  });
});
