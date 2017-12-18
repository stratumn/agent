import React from 'react';
import { MapExplorer } from '@indigoframework/react-mapexplorer';

import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

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
    notifications: [],
    selectSegment: () => {},
    removeSegmentNotifications: () => {}
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
      .withAppendedSegment()
      .withNotifications([
        { key: 'foo', mapId: '42' },
        { key: 'bar', mapId: '53' }
      ])
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
      mapId: '42',
      notifications: [{ key: 'foo', mapId: '42' }]
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
      notifications: [],
      mapId: '42'
    });
  });

  it('should remove notification after render', () => {
    const removeNotifySpy = sinon.spy();
    const thisProps = {
      ...validProps,
      removeSegmentNotifications: removeNotifySpy,
      mapId: 'bar'
    };
    const mapPage = shallow(<MapPage {...thisProps} />);
    mapPage.setProps({
      ...thisProps,
      notifications: [{ key: 'foo', mapId: 'bar' }]
    });
    expect(removeNotifySpy.callCount).to.equal(1);
    expect(removeNotifySpy.getCall(0).args[0]).to.deep.equal(['foo']);
  });
});
