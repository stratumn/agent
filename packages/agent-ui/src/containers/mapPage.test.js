import React from 'react';
import { MapExplorer } from 'react-mapexplorer';

import { shallow } from 'enzyme';
import { expect } from 'chai';

import * as statusTypes from '../constants/status';

import {
  TestAgentBuilder,
  TestProcessBuilder,
  TestStateBuilder
} from '../test/builders/state';

import { MapPage, mapStateToProps } from './mapPage';

describe('<MapPage />', () => {
  const validProps = {
    agent: {
      name: 'myAgent',
      url: 'http://localhost:42'
    },
    process: {
      name: 'proc42'
    },
    mapId: '42',
    lastLinkHash: '42x',
    selectSegment: () => {}
  };

  it('should render a MapExplorer component', () => {
    const mapPage = shallow(<MapPage {...validProps} />);
    expect(mapPage.find(MapExplorer)).to.have.length(1);
  });

  it('should display an error if agent url is missing', () => {
    const mapPage = shallow(
      <MapPage {...validProps} agent={{ name: 'missing-url' }} />
    );
    expect(mapPage.find(MapExplorer)).to.have.length(0);
    expect(mapPage.find('.error')).to.have.length(1);
  });

  it('should extract agent, process and map information', () => {
    const process = new TestProcessBuilder('p1').build();
    const agent = new TestAgentBuilder()
      .withUrl('http://localhost:4242')
      .withProcess(process)
      .build();
    const state = new TestStateBuilder()
      .withAgent('agent', agent)
      .withAppendedSegment('lh')
      .build();
    const routeProps = {
      match: { params: { agent: 'agent', process: 'p1', id: '42' } }
    };

    const props = mapStateToProps(state, routeProps);
    expect(props).to.deep.equal({
      agent: {
        name: 'agent',
        url: 'http://localhost:4242'
      },
      process: {
        name: 'p1'
      },
      lastLinkHash: 'lh',
      mapId: '42'
    });
  });

  it('should not fail props if agent or process is missing', () => {
    const agent = new TestAgentBuilder().withStatus(statusTypes.FAILED).build();
    const state = new TestStateBuilder().withAgent('a', agent).build();
    const routeProps = {
      match: { params: { agent: 'a', process: 'cannotFindMe', id: '42' } }
    };

    const props = mapStateToProps(state, routeProps);
    expect(props).to.deep.equal({
      agent: {
        name: 'a'
      },
      process: {
        name: 'cannotFindMe'
      },
      lastLinkHash: undefined,
      mapId: '42'
    });
  });
});
