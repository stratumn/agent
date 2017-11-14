import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { TestStateBuilder } from '../test/builders/state';

import { ContentPage } from './contentPage';
import { AgentsPage } from './agentsPage';
import { AgentInfoPage } from './agentInfoPage';
import { MapPage } from './mapPage';

describe('<ContentPage />', () => {
  const testState = new TestStateBuilder().build();
  const mockStore = configureStore();
  const store = mockStore(testState);

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

  it('renders the <MapPage /> if route contains a map id', () => {
    const mapPage = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/agent/process/maps/mapId']}>
          <ContentPage />
        </MemoryRouter>
      </Provider>
    );

    expect(mapPage.find(MapPage)).to.have.length(1);
  });
});
