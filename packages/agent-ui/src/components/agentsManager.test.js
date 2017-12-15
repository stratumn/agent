import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as statusTypes from '../constants/status';
import AgentsManager from './agentsManager';

chai.use(sinonChai);

describe('<AgentsManager />', () => {
  const requiredProps = {
    addAgent: sinon.spy(),
    deleteAgent: sinon.spy(),
    agents: []
  };

  const mountAgentsManager = props =>
    mount(<AgentsManager {...requiredProps} {...props} />);

  it('does not add agent if name or url is missing', () => {
    const agentsPage = mountAgentsManager();
    agentsPage.find('Button[type="add"]').simulate('click');
    expect(requiredProps.addAgent.callCount).to.equal(0);
  });

  it('adds agent when button is clicked with agent name and url provided', () => {
    const agentsPage = mountAgentsManager();

    const agentName = agentsPage.find('input').at(0);
    agentName.simulate('change', { target: { value: 'agent1' } });
    const agentUrl = agentsPage.find('input').at(1);
    agentUrl.simulate('change', { target: { value: 'url1' } });

    agentsPage.find('Button[type="add"]').simulate('click');
    expect(requiredProps.addAgent.callCount).to.equal(1);
    expect(requiredProps.addAgent.getCall(0).args).to.deep.equal([
      'agent1',
      'url1'
    ]);
  });

  it('displays loaded and failed agents', () => {
    const agents = [
      { name: 'a1', url: 'u1' },
      { name: 'a2', url: 'u2' },
      { name: 'a3', url: 'u3', status: statusTypes.FAILED }
    ];
    const agentsPage = mountAgentsManager({ agents });

    const agentsRows = agentsPage.find('TableBody').find('TableRow');
    expect(agentsRows).to.have.length(4);
    expect(
      agentsRows
        .at(1)
        .find('TableCell')
        .at(0)
        .text()
    ).to.equal('a2');
    expect(
      agentsRows
        .at(1)
        .find('TableCell')
        .at(1)
        .text()
    ).to.equal('u2');
    expect(agentsRows.at(1).props().className).to.not.contain('tableRowError');
    expect(agentsRows.at(2).props().className).to.contain('tableRowError');
  });

  it('provides a button to remove an agent', () => {
    const agents = [{ name: 'a1', url: 'u1' }, { name: 'a2', url: 'u2' }];
    const agentsPage = mountAgentsManager({ agents });

    expect(agentsPage.find('Button[type="remove"]')).to.have.length(2);
    const firstButton = agentsPage.find('Button[type="remove"]').at(0);
    firstButton.simulate('click');
    expect(requiredProps.deleteAgent.callCount).to.equal(1);
    expect(requiredProps.deleteAgent.getCall(0).args[0]).to.equal('a1');
  });
});
