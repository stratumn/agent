import React from 'react';
import { MemoryRouter, NavLink } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { TopBar } from './topBar';
import { CreateMapButton } from './createMapButton';

describe('<TopBar />', () => {
  const mockStore = configureStore();
  const store = mockStore({ agents: {} });

  const renderTopBarWithRoute = path =>
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <TopBar path={path} />
        </MemoryRouter>
      </Provider>
    );

  it('renders a title on index page', () => {
    const topBarNoLinks = shallow(<TopBar path="/" />);
    expect(
      topBarNoLinks.find('div').contains('Welcome to the Indigo Framework UI')
    ).to.be.true;
  });

  it('renders links to url sub-paths', () => {
    const topBarWithLinks = renderTopBarWithRoute('/agent/process/maps');

    const navLinks = topBarWithLinks.find(NavLink);
    expect(navLinks).to.have.length(3);

    expect(navLinks.at(0).props().to).to.equal('/agent');
    expect(navLinks.at(0).text()).to.equal('agent');

    expect(navLinks.at(1).props().to).to.equal('/agent/process');
    expect(navLinks.at(1).text()).to.equal('process');

    expect(navLinks.at(2).props().to).to.equal('/agent/process/maps');
    expect(navLinks.at(2).text()).to.equal('maps');
  });

  it('renders a create map button on maps page', () => {
    const topBarWithCreateMap = renderTopBarWithRoute('/agent/process/maps');
    expect(topBarWithCreateMap.find(CreateMapButton)).to.have.length(1);
  });

  it('does not render a create map button on other pages', () => {
    const topBarWithCreateMap = renderTopBarWithRoute('/agent');
    expect(topBarWithCreateMap.find(CreateMapButton)).to.have.length(0);
  });
});
