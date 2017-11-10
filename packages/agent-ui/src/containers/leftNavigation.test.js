import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import { expect } from 'chai';

import { LeftNavigation, mapStateToProps } from './leftNavigation';
import * as statusTypes from '../constants/status';

describe('<LeftNavigation />', () => {
  it('displays the list of agents, processes, maps and segments', () => {
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
    expect(links).to.have.length(12);

    const linksTexts = links.map(l => l.text());
    const expected = [
      'a1',
      'p1',
      'maps',
      'segments',
      'p2',
      'maps',
      'segments',
      'a2',
      'p3',
      'maps',
      'segments',
      'a3'
    ];
    expect(linksTexts).to.deep.equal(expected);
  });

  it('correctly maps state to props', () => {
    const state = {
      agents: {
        a1: {
          status: statusTypes.LOADED,
          processes: {
            p1: {},
            p2: {}
          }
        },
        a2: {
          status: statusTypes.LOADED
        },
        a3: {
          status: statusTypes.LOADING,
          processes: {
            foo: {},
            bar: {}
          }
        }
      }
    };

    const props = mapStateToProps(state);
    expect(props.agents).to.deep.equal([
      { name: 'a1', processes: ['p1', 'p2'] },
      { name: 'a2', processes: [] }
    ]);
  });
});
