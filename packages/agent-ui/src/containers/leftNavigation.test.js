import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import { expect } from 'chai';

import {
  TestStateBuilder,
  TestProcessBuilder,
  TestAgentBuilder
} from '../test/builders/state';

import { LeftNavigation, mapStateToProps } from './leftNavigation';
import * as statusTypes from '../constants/status';

describe('<LeftNavigation />', () => {
  const testState = new TestStateBuilder()
    .withAgent(
      'a1',
      new TestAgentBuilder()
        .withStatus(statusTypes.LOADED)
        .withProcess(new TestProcessBuilder('p1').build())
        .withProcess(new TestProcessBuilder('p2').build())
        .build()
    )
    .withAgent(
      'a2',
      new TestAgentBuilder()
        .withStatus(statusTypes.LOADED)
        .withProcess(new TestProcessBuilder('p3').build())
        .build()
    )
    .withAgent(
      'a3',
      new TestAgentBuilder().withStatus(statusTypes.LOADING).build()
    )
    .withAgent(
      'a4',
      new TestAgentBuilder().withStatus(statusTypes.LOADED).build()
    )
    .build();

  const requiredProps = {
    classes: { drawerPaper: '' }
  };

  it('displays the list of agents, processes, maps and segments', () => {
    const testRoutes = (route, expectedLinks) => {
      const mappedProps = mapStateToProps(testState, {
        location: { pathname: route }
      });
      const props = {
        ...requiredProps,
        ...mappedProps
      };

      const leftNav = mount(
        <MemoryRouter>
          <LeftNavigation {...props} />
        </MemoryRouter>
      );

      const visibleLinks = leftNav
        .find('AgentNavigationLink')
        .filterWhere(a => !a.parents('Collapse[in=false]').exists());
      expect(visibleLinks).to.have.length(expectedLinks.length);

      const linksTexts = visibleLinks.map(l => l.text());
      expect(linksTexts).to.deep.equal(expectedLinks);
    };

    const routes = [
      { route: '/', links: ['a1', 'a2', 'a4'] },
      { route: '/a1', links: ['a1', 'p1', 'p2', 'a2', 'a4'] },
      {
        route: '/a1/p1',
        links: ['a1', 'p1', 'maps', 'segments', 'p2', 'a2', 'a4']
      },
      { route: '/a2', links: ['a1', 'a2', 'p3', 'a4'] },
      { route: '/a2/p3', links: ['a1', 'a2', 'p3', 'maps', 'segments', 'a4'] },
      {
        route: '/a2/p3/maps',
        links: ['a1', 'a2', 'p3', 'maps', 'segments', 'a4']
      },
      { route: '/a4', links: ['a1', 'a2', 'a4'] },
      { route: '/a4/p4', links: ['a1', 'a2', 'a4'] }
    ];

    routes.forEach(({ route, links }) => testRoutes(route, links));
  });

  it('correctly maps state to props', () => {
    const ownProps = { location: { pathname: '/a/p/maps' } };

    const props = mapStateToProps(testState, ownProps);
    expect(props.agents).to.deep.equal([
      { name: 'a1', processes: ['p1', 'p2'] },
      { name: 'a2', processes: ['p3'] },
      { name: 'a4', processes: [] }
    ]);
    expect(props.agent).to.equal('a');
    expect(props.process).to.equal('p');
  });
});
