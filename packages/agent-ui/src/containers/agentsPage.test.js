import React from 'react';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { TestStateBuilder, TestAgentBuilder } from '../test/builders/state';

import { statusTypes } from '../reducers';
import { AgentsPage, mapStateToProps } from './agentsPage';

chai.use(sinonChai);

describe('<AgentsPage />', () => {
  it('contains a form to add a new agent to monitor', () => {
    const fetchAgentSpy = sinon.spy();
    const agentsPage = shallow(<AgentsPage fetchAgent={fetchAgentSpy} />);
    const addAgentForm = agentsPage.find('form');
    expect(addAgentForm).to.have.lengthOf(1);
    expect(addAgentForm.find('button')).to.have.lengthOf(1);
  });

  it('does not fetch agent if name or url is not filled in', () => {
    const fetchAgentSpy = sinon.spy();
    const agentsPage = mount(<AgentsPage fetchAgent={fetchAgentSpy} />);
    agentsPage.find('form').simulate('submit');
    expect(fetchAgentSpy.callCount).to.equal(0);
  });

  it('fetches agent when form is submitted', () => {
    const fetchAgentSpy = sinon.spy();
    const agentsPage = mount(<AgentsPage fetchAgent={fetchAgentSpy} />);

    const agentName = agentsPage.find('input').at(0);
    agentName.instance().value = 'Agent Name';
    const agentUrl = agentsPage.find('input').at(1);
    agentUrl.instance().value = 'Agent Url';

    agentsPage.find('form').simulate('submit');
    expect(fetchAgentSpy.callCount).to.equal(1);
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

    const state = new TestStateBuilder()
      .withAgent('a1', loadedAgent1)
      .withAgent('a0', notLoadedAgent)
      .withAgent('a2', loadedAgent2)
      .build();

    const { agents } = mapStateToProps(state);

    expect(agents).to.have.length(2);
    expect(agents[0].name).to.equal('a1');
    expect(agents[0].url).to.equal('http://localhost:42');
    expect(agents[1].name).to.equal('a2');
    expect(agents[1].url).to.equal('http://localhost:43');
  });

  it('displays loaded agents', () => {
    const agents = [{ name: 'a1', url: 'u1' }, { name: 'a2', url: 'u2' }];
    const agentsPage = mount(
      <AgentsPage agents={agents} fetchAgent={() => {}} />
    );

    expect(agentsPage.find('div').contains('a1: u1')).to.be.true;
    expect(agentsPage.find('div').contains('a2: u2')).to.be.true;
  });
});
