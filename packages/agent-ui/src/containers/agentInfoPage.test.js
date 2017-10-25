import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import { expect } from 'chai';

import { AgentInfoPage } from './agentInfoPage';

describe('<AgentInfoPage />', () => {
  it('displays the agent name and url', () => {
    const agentName = 'test';
    const agentUrl = 'http://localhost:3000';
    const agentInfoPage = mount(
      <MemoryRouter>
        <AgentInfoPage name={agentName} url={agentUrl} />
      </MemoryRouter>
    );

    const agentInfo = agentInfoPage.find('p').map(p => p.text());
    expect(agentInfo.includes(agentName)).to.equal(true);
    expect(agentInfo.includes(agentUrl)).to.equal(true);
  });

  it('provides a button to refresh agent', () => {});
  it('displays a custom message when agent was not loaded', () => {});
  it('provides a link to the add agent page', () => {});
});
