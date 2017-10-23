import React from 'react';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { AgentsPage } from './agentsPage';

chai.use(sinonChai);

describe('<AgentsPage />', () => {
  it('contains a form to add a new agent to monitor', () => {
    const fetchAgentSpy = sinon.spy();
    const agentsPage = mount(<AgentsPage fetchAgent={fetchAgentSpy} />);
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
});
