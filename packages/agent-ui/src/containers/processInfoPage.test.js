import React from 'react';

import { mount } from 'enzyme';
import { expect } from 'chai';

import {
  TestAgentBuilder,
  TestProcessBuilder,
  TestStateBuilder
} from '../test/builders/state';

import { ProcessInfoPage, mapStateToProps } from './processInfoPage';

describe('<ProcessInfoPage />', () => {
  it('extracts the right process from the state', () => {
    const routeProps = { match: { params: { agent: 'a', process: 'p' } } };

    const selectedProcess = new TestProcessBuilder('p').build();
    const otherProcess = new TestProcessBuilder('notP').build();
    const agent = new TestAgentBuilder()
      .withProcess(otherProcess)
      .withProcess(selectedProcess)
      .build();
    const state = new TestStateBuilder()
      .withAgent('notA', new TestAgentBuilder().build())
      .withAgent('a', agent)
      .build();

    const props = mapStateToProps(state, routeProps);
    expect(props.process).to.equal(selectedProcess);
  });

  it('handles process not found in state', () => {
    const routeProps = { match: { params: { agent: 'a', process: 'p' } } };
    const agent = new TestAgentBuilder()
      .withProcess(new TestProcessBuilder('notP').build())
      .build();
    const state = new TestStateBuilder().withAgent('a', agent).build();

    const props = mapStateToProps(state, routeProps);
    expect(props.process).to.be.undefined;
  });
});
