import React from 'react';
import { MemoryRouter, NavLink } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { TopBar } from './topBar';
import { TopBarButton } from '../components';

describe('<TopBar />', () => {
  const requiredProps = {
    match: { params: { agent: 'a', process: 'p' } },
    mapDialog: () => {},
    segmentDialog: () => {},
    classes: { appBar: '' }
  };

  const mockStore = configureStore();
  const store = mockStore({ agents: {} });

  const renderTopBarWithRoute = path =>
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <TopBar path={path} {...requiredProps} />
        </MemoryRouter>
      </Provider>
    );

  it('renders a title on index page', () => {
    const topBarNoLinks = renderTopBarWithRoute('/');
    expect(
      topBarNoLinks
        .find('Typography')
        .contains('Welcome to the Stratumn Agent UI')
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

  it('does not render buttons on irrelevant pages', () => {
    const topBarWithoutButtons = renderTopBarWithRoute('/agent');
    expect(topBarWithoutButtons.find(TopBarButton)).to.have.length(0);
  });

  const verifyButton = (topBar, expectedText) => {
    expect(topBar.find(TopBarButton)).to.have.length(1);

    const button = topBar.find(TopBarButton).at(0);
    expect(button.text()).to.equal(expectedText);
  };

  it('renders a create map button on maps page', () => {
    const topBarWithCreateMap = renderTopBarWithRoute('/agent/process/maps');
    verifyButton(topBarWithCreateMap, 'Create');
  });

  it('renders an append segment button on map page', () => {
    const topBarWithAppendSegment = renderTopBarWithRoute(
      '/agent/process/maps/thisIsAMapId'
    );
    verifyButton(topBarWithAppendSegment, 'Append');
  });

  it('renders short hash for segment id', () => {
    const topBarWithLinks = renderTopBarWithRoute(
      '/agent/process/segments/thisIsALongStringThatShouldBeShorter'
    );

    const navLinks = topBarWithLinks.find(NavLink);
    expect(navLinks).to.have.length(4);

    expect(navLinks.at(3).text()).to.equal('thisIsAL..er');
  });

  it('renders full hash for map id', () => {
    const topBarWithLinks = renderTopBarWithRoute(
      '/agent/process/maps/thisIsALongStringThatShouldBeShorter'
    );

    const navLinks = topBarWithLinks.find(NavLink);
    expect(navLinks).to.have.length(4);

    expect(navLinks.at(3).text()).to.equal(
      'thisIsALongStringThatShouldBeShorter'
    );
  });
});
