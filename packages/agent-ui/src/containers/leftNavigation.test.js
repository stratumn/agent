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

    const testRoutes = (route, expectedLinks) => {
      const agentsPage = mount(
        <MemoryRouter initialEntries={[route]}>
          <LeftNavigation agents={agents} />
        </MemoryRouter>
      );

      const links = agentsPage.find('NavLink');
      expect(links).to.have.length(expectedLinks.length);

      const linksTexts = links.map(l => l.text());
      expect(linksTexts).to.deep.equal(expectedLinks);
    };

    const routes = [
      { route: '/', links: ['a1', 'a2', 'a3'] },
      { route: '/a1', links: ['a1', 'p1', 'p2', 'a2', 'a3'] },
      {
        route: '/a1/p1',
        links: ['a1', 'p1', 'maps', 'segments', 'p2', 'a2', 'a3']
      },
      { route: '/a2', links: ['a1', 'a2', 'p3', 'a3'] },
      { route: '/a2/p3', links: ['a1', 'a2', 'p3', 'maps', 'segments', 'a3'] },
      {
        route: '/a2/p3/maps',
        links: ['a1', 'a2', 'p3', 'maps', 'segments', 'a3']
      },
      { route: '/a3', links: ['a1', 'a2', 'a3'] },
      { route: '/a3/p4', links: ['a1', 'a2', 'a3'] }
    ];

    routes.forEach(({ route, links }) => testRoutes(route, links));
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
