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

  const requiredProps = {
    classes: { content: '' }
  };

  const mountContentPage = initialEntries =>
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <ContentPage {...requiredProps} />
        </MemoryRouter>
      </Provider>
    );

  it('renders the <AgentsPage /> if no route information', () => {
    const defaultPage = mountContentPage();

    expect(defaultPage.find(AgentsPage)).to.have.length(1);
    expect(defaultPage.find(AgentInfoPage)).to.have.length(0);
  });

  it('renders the <AgentInfoPage /> if route contains agent name', () => {
    const agentInfoPage = mountContentPage(['/agent']);

    expect(agentInfoPage.find(AgentsPage)).to.have.length(0);
    expect(agentInfoPage.find(AgentInfoPage)).to.have.length(1);
  });

  it('renders the <MapPage /> if route contains a map id', () => {
    const mapPage = mountContentPage(['/agent/process/maps/mapId']);

    expect(mapPage.find(MapPage)).to.have.length(1);
  });
});
