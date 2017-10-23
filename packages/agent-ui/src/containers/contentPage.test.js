import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { ContentPage } from './contentPage';
import { AgentsPage } from './agentsPage';
import { AgentInfoPage } from './agentInfoPage';

describe('<ContentPage />', () => {
  const mockStore = configureStore();
  const store = mockStore({ agents: {} });

  it('renders the <AgentsPage /> if no route information', () => {
    const defaultPage = mount(
      <Provider store={store}>
        <MemoryRouter>
          <ContentPage />
        </MemoryRouter>
      </Provider>
    );

    expect(defaultPage.find(AgentsPage)).to.have.length(1);
    expect(defaultPage.find(AgentInfoPage)).to.have.length(0);
  });

  it('renders the <AgentInfoPage /> if route contains agent name', () => {
    const agentInfoPage = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/agent']}>
          <ContentPage />
        </MemoryRouter>
      </Provider>
    );

    expect(agentInfoPage.find(AgentsPage)).to.have.length(0);
    expect(agentInfoPage.find(AgentInfoPage)).to.have.length(1);
  });
});
