import { ChainTree } from 'mapexplorer-core';
import { defaultOptions } from 'mapexplorer-core';
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
