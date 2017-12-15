import React from 'react';

import { mount } from 'enzyme';
import { expect } from 'chai';

import { TestStateBuilder, TestAgentBuilder } from '../test/builders/state';

import * as statusTypes from '../constants/status';
import { AgentsPage, mapStateToProps } from './agentsPage';

describe('<AgentsPage />', () => {
  const requiredProps = {
    fetchAgent: () => {},
    deleteAgent: () => {}
  };

  it('contains an AgentsManager to add new agents to monitor', () => {
    const loadedAgents = [{ name: 'a1', url: 'http://localhost:3000' }];
    const agentsPage = mount(
      <AgentsPage {...requiredProps} agents={loadedAgents} />
    );

    const agentsManager = agentsPage.find('AgentsManager');
    expect(agentsManager).to.have.lengthOf(1);
    expect(agentsManager.props().agents).to.equal(loadedAgents);
    expect(agentsManager.props().addAgent).to.equal(requiredProps.fetchAgent);
    expect(agentsManager.props().deleteAgent).to.equal(
      requiredProps.deleteAgent
    );
  });

  it('extracts loaded agents from state', () => {
    const loadedAgent1 = new TestAgentBuilder()
      .withStatus(statusTypes.LOADED)
      .withUrl('http://localhost:42')
      .build();
    const loadedAgent2 = new TestAgentBuilder()
      .withStatus(statusTypes.LOADED)
      .withUrl('http://localhost:43')
      .build();
    const notLoadedAgent = new TestAgentBuilder()
      .withStatus(statusTypes.LOADING)
      .build();
    const failedAgent = new TestAgentBuilder()
      .withStatus(statusTypes.FAILED)
      .withUrl('not/a/url')
      .build();

    const state = new TestStateBuilder()
      .withAgent('a1', loadedAgent1)
      .withAgent('a0', notLoadedAgent)
      .withAgent('a2', loadedAgent2)
      .withAgent('a3', failedAgent)
      .build();

    const { agents } = mapStateToProps(state);

    expect(agents).to.have.length(3);
    expect(agents).to.deep.equal([
      { name: 'a1', url: 'http://localhost:42', status: statusTypes.LOADED },
      { name: 'a2', url: 'http://localhost:43', status: statusTypes.LOADED },
      { name: 'a3', url: 'not/a/url', status: statusTypes.FAILED }
    ]);
  });
});
