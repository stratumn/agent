import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import { expect } from 'chai';

import { LeftNavigation, mapStateToProps } from './leftNavigation';

describe('<LeftNavigation />', () => {
  it('displays the list of agents and processes', () => {
    const agents = [
      { name: 'a1', processes: ['p1', 'p2'] },
      { name: 'a2', processes: ['p3'] },
      { name: 'a3', processes: [] }
    ];

    const agentsPage = mount(
      <MemoryRouter>
        <LeftNavigation agents={agents} />
      </MemoryRouter>
    );

    const links = agentsPage.find('NavLink');
    expect(links).to.have.length(6);

    const linksTexts = links.map(l => l.text());
    ['a1', 'a2', 'a3', 'p1', 'p2', 'p3'].map(val =>
      expect(linksTexts.includes(val)).to.equal(true)
    );
  });

  it('correctly maps state to props', () => {
    const state = {
      agents: {
        a1: {
          processes: {
            p1: {}
          }
        },
        a2: {}
      }
    };

    const props = mapStateToProps(state);
    expect(props.agents).to.deep.equal([
      { name: 'a1', processes: ['p1'] },
      { name: 'a2', processes: [] }
    ]);
  });
});
