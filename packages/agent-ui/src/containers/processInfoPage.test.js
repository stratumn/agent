import React from 'react';

import { mount, shallow } from 'enzyme';
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
    expect(props.agent).to.equal('a');
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

  it('displays an error message when process is not found', () => {
    const processInfoPage = shallow(<ProcessInfoPage />);
    expect(processInfoPage.find('.error')).to.have.length(1);
  });

  it('displays agent and process name', () => {
    const process = new TestProcessBuilder('warehouse42').build();
    const processInfoPage = shallow(
      <ProcessInfoPage agent="agent007" process={process} />
    );

    expect(processInfoPage.find('.error')).to.have.length(0);
    expect(processInfoPage.find('div').contains('agent007')).to.be.true;
    expect(processInfoPage.find('div').contains('warehouse42')).to.be.true;
  });

  it('displays process actions', () => {
    const process = new TestProcessBuilder('warehouse42')
      .withAction('login', ['name', 'password'])
      .withAction('logout', [])
      .build();
    const processInfoPage = shallow(<ProcessInfoPage process={process} />);

    expect(processInfoPage.find('li')).to.have.length(2);
    expect(processInfoPage.find('li').contains('login(name, password)')).to.be
      .true;
    expect(processInfoPage.find('li').contains('logout()')).to.be.true;
  });

  it('displays store information', () => {
    const process = new TestProcessBuilder('warehouse42')
      .withStore('candyStore', 'v1', 'c1', 'welcome to the candy store')
      .build();
    const processInfoPage = shallow(<ProcessInfoPage process={process} />);

    expect(processInfoPage.find('div').contains('candyStore')).to.be.true;
  });
});
