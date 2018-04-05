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

import { select, selectAll } from 'd3-selection';
import { ChainTree, defaultOptions } from '../../src/index';
import validMap from '../fixtures/fullMap.json';
import validMapWithRefs from '../fixtures/fullMapWithRefs.json';

describe('ChainTree', () => {
  let tree;
  let resolveSvg;

  describe('using an empty map', () => {
    beforeEach(() => {
      tree = new ChainTree('body', defaultOptions).display(null);

      resolveSvg = tree.then(() => select('body').select('svg'));
    });

    afterEach(() => {
      selectAll('svg').remove();
    });

    it('should draw an empty svg', () =>
      resolveSvg.then(svg => {
        svg
          .selectAll('g.node')
          .size()
          .should.be.eql(0);
      }));
  });

  describe('using a regular map', () => {
    beforeEach(() => {
      tree = new ChainTree('body', defaultOptions).display(validMap);

      resolveSvg = tree.then(() => select('body').select('svg'));
    });

    afterEach(() => {
      selectAll('svg').remove();
    });

    it('should draw a node by segment', () =>
      resolveSvg.then(svg => {
        svg
          .selectAll('g.node')
          .size()
          .should.be.eql(validMap.length);
      }));

    it('should draw a link between segments', () =>
      resolveSvg.then(svg => {
        svg
          .selectAll('path.link:not(.init)')
          .size()
          .should.be.eql(validMap.length - 1);
      }));

    it('should draw an init link', () =>
      resolveSvg.then(svg => {
        svg
          .selectAll('path.link')
          .filter('.init')
          .size()
          .should.be.eql(1);
      }));

    it('should add a class to segments with tags', () =>
      resolveSvg.then(svg => {
        svg
          .selectAll('g.node')
          .filter('.win')
          .size()
          .should.be.eql(1);
      }));

    it('should display the action on links', () =>
      resolveSvg.then(svg => {
        svg
          .selectAll('.textpath')
          .text()
          .should.be.eql('register');
      }));
  });

  describe('using a map containing references', () => {
    let refs;
    let externalRefNodes;
    let internalRefs;

    beforeEach(() => {
      tree = new ChainTree('body', defaultOptions).display(validMapWithRefs);

      refs = validMapWithRefs.reduce(
        (acc, val) => acc.concat(val.link.meta.refs || []),
        []
      );

      externalRefNodes = refs.reduce((acc, val) => {
        const refNodes = acc;
        const existingNode = acc.find(r => r.linkHash === val.linkHash);
        const internalNode = validMapWithRefs.find(
          n => n.meta.linkHash === val.linkHash
        );
        if (!existingNode && !internalNode) {
          refNodes.push(val);
        }
        return refNodes;
      }, []);

      internalRefs = refs.reduce((acc, val) => {
        const iRefs = acc;
        const isInMap = validMapWithRefs.find(
          s => s.meta.linkHash === val.linkHash
        );
        const alreadyExist = acc.find(r => r.linkHash === val.linkHash);
        if (isInMap && !alreadyExist) {
          iRefs.push(val);
        }
        return iRefs;
      }, []);
      resolveSvg = tree.then(() => select('body').select('svg'));
    });

    afterEach(() => {
      selectAll('svg').remove();
    });

    it('should draw a node by segment and external reference', () =>
      resolveSvg.then(svg => {
        svg
          .selectAll('g.node')
          .size()
          .should.be.eql(validMapWithRefs.length + externalRefNodes.length);
      }));

    it('should draw a link between segments', () =>
      resolveSvg.then(svg => {
        svg
          .selectAll('path.link:not(.init)')
          .size()
          .should.be.eql(validMapWithRefs.length + internalRefs.length - 1);
      }));

    it('should draw an init link', () => {
      resolveSvg.then(svg => {
        svg
          .selectAll('path.link')
          .filter('.init')
          .size()
          .should.be.eql(1);
      });
    });

    it('should display the action on links', () => {
      resolveSvg.then(svg => {
        svg
          .selectAll('.actionLabel')
          .size()
          .should.be.eql(validMapWithRefs.length + internalRefs.length - 1);
      });
    });

    it('displays ref node related links', () => {
      const e = document.createEvent('UIEvents');
      e.initUIEvent('click', true, true);
      resolveSvg.then(svg => {
        svg
          .select('g.node.ref')
          .node()
          .dispatchEvent(e);
        svg
          .selectAll('path.link')
          .size()
          .should.be.eql(3);
        svg
          .selectAll('#ref-link')
          .size()
          .should.be.eql(1);
        svg
          .selectAll('.selected')
          .size()
          .should.be.eql(1);
      });
    });

    it('displays base node related links', () => {
      const e = document.createEvent('UIEvents');
      e.initUIEvent('click', true, true);
      resolveSvg.then(svg => {
        svg
          .select(
            'g .node.base#a6c12f3621882a44d2619d094056de6ccdc5b5726c344b1b4387417a6f1d268e'
          )
          .node()
          .dispatchEvent(e);
        svg
          .selectAll('path.link')
          .size()
          .should.be.eql(4);
        svg
          .selectAll('#ref-link')
          .size()
          .should.be.eql(0);
      });
    });
  });

  describe('with specific options', () => {
    afterEach(() => {
      selectAll('svg').remove();
    });

    it('should disable withFocus', () => {
      const options = Object.assign(defaultOptions, { withFocus: false });
      tree = new ChainTree('body', options).display(validMap);

      const e = document.createEvent('UIEvents');
      e.initUIEvent('click', true, true);

      tree.then(() => {
        const svg = select('body').select('svg');
        svg
          .select('g.node')
          .node()
          .dispatchEvent(e);

        svg
          .selectAll('.selected')
          .size()
          .should.be.eql(0);
      });
    });
  });
});
