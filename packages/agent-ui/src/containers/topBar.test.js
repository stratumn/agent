import React from 'react';
import { MemoryRouter, NavLink } from 'react-router-dom';

import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { TopBar } from './topBar';

describe('<TopBar />', () => {
  it('renders a title on index page', () => {
    const topBarNoLinks = shallow(<TopBar path="/" />);
    expect(
      topBarNoLinks.find('div').contains('Welcome to the Indigo Framework UI')
    ).to.be.true;
  });

  it('renders links to url sub-paths', () => {
    const topBarWithLinks = mount(
      <MemoryRouter initialEntries={['/agent/process/maps']}>
        <TopBar path="/agent/process/maps" />
      </MemoryRouter>
    );

    const navLinks = topBarWithLinks.find(NavLink);
    expect(navLinks).to.have.length(3);

    expect(navLinks.at(0).props().to).to.equal('/agent');
    expect(navLinks.at(0).text()).to.equal('agent');

    expect(navLinks.at(1).props().to).to.equal('/agent/process');
    expect(navLinks.at(1).text()).to.equal('process');

    expect(navLinks.at(2).props().to).to.equal('/agent/process/maps');
    expect(navLinks.at(2).text()).to.equal('maps');
  });
});
