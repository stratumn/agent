import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { AgentInfoPage } from './agentInfoPage';
import * as statusTypes from '../constants/status';

chai.use(sinonChai);

describe('<AgentInfoPage />', () => {
  const requiredProps = {
    name: '',
    url: '',
    status: '',
    fetchAgent: () => {},
    classes: { circular: '' }
  };

  const mountPage = props =>
    mount(
      <MemoryRouter>
        <AgentInfoPage {...requiredProps} {...props} />
      </MemoryRouter>
    );

  it('displays the agent name and url', () => {
    const agentName = 'test';
    const agentUrl = 'http://localhost:3000';
    const agentInfoPage = mountPage({
      name: agentName,
      url: agentUrl
    });

    const agentInfo = agentInfoPage.find('Typography').map(p => p.text());
    expect(agentInfo.includes(agentName)).to.equal(true);
    expect(agentInfo.includes(agentUrl)).to.equal(true);
  });

  it('provides a button to refresh agent', () => {
    const fetchAgentSpy = sinon.spy();
    const agentInfoPage = mountPage({
      name: 'dummy',
      url: 'http://my.awesome.agent',
      fetchAgent: fetchAgentSpy
    });

    const refreshButton = agentInfoPage.find('button');
    expect(refreshButton.length).to.equal(1);

    refreshButton.simulate('click');
    expect(fetchAgentSpy.callCount).to.equal(1);
    const fetchAgentArgs = fetchAgentSpy.getCall(0).args;
    expect(fetchAgentArgs.length).to.equal(2);
    expect(fetchAgentArgs[0]).to.equal('dummy');
    expect(fetchAgentArgs[1]).to.equal('http://my.awesome.agent');
  });

  it('displays a loading spinner when agent is loading', () => {
    const agentInfoPage = mountPage({ status: statusTypes.LOADING });
    expect(agentInfoPage.find('CircularProgress')).to.have.length(1);
  });

  it('displays a custom error message when agent loading failed', () => {
    const agentInfoPage = shallow(
      <AgentInfoPage {...requiredProps} status={statusTypes.FAILED} />
    );
    expect(agentInfoPage.find('.error').length).to.equal(1);
  });

  it('does not display an error message when agent was loaded successfully', () => {
    const agentInfoPage = shallow(
      <AgentInfoPage {...requiredProps} status={statusTypes.LOADED} />
    );
    expect(agentInfoPage.find('.error').length).to.equal(0);
  });

  it('provides a link to the add agent page', () => {
    const agentInfoPage = mountPage({ status: statusTypes.LOADED });

    expect(agentInfoPage.find('NavLink').length).to.equal(1);
    const linkToAddAgent = agentInfoPage.find('NavLink').at(0);
    expect(linkToAddAgent.props().to).to.equal('/');
  });
});
