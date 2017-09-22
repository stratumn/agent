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

import { ChainTree, defaultOptions } from '../../src/index';
import { select, selectAll } from 'd3-selection';

import validMap from '../fixtures/fullMap.json';

describe('ChainTree', () => {

  let tree;
  let svg;

  beforeEach(() => {
    tree = new ChainTree('body');
    tree.display(validMap, defaultOptions);

    svg = select('body').select('svg');
  });

  afterEach(() => {
    selectAll('svg').remove();
  });

  it('should draw a node by segment', () => {
    svg.selectAll('g.node').size().should.be.eql(validMap.length);
  });

  it('should draw a link between segments', () => {
    svg.selectAll('path.link:not(.init)').size().should.be.eql(validMap.length - 1);
  });

  it('should draw an init link', () => {
    svg.selectAll('path.link').filter('.init').size().should.be.eql(1);
  });

  it('should add a class to segments with tags', () => {
    svg.selectAll('g.node').filter('.win').size().should.be.eql(1);
  });

  it('should display the action on links', () => {
    svg.selectAll('.textpath').text().should.be.eql('register');
  });
});
