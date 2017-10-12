import React from 'react';
import { Provider } from 'react-redux';

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { expect } from 'chai';

import AgentInfoPage from '../components/agentInfoPage';
import configureStore from '../store/configure';

describe('Agent Info Page', () => {
  configure({ adapter: new Adapter() });

  let props;
  let mountedAgentInfoPage;
  const testStore = configureStore();

  const agentInfoPage = () => {
    if (!mountedAgentInfoPage) {
      mountedAgentInfoPage = mount(
        <Provider store={testStore}>
          <AgentInfoPage {...props} />
        </Provider>
      );
    }

    return mountedAgentInfoPage;
  };

  beforeEach(() => {
    props = {};
    mountedAgentInfoPage = undefined;
  });

  it('always renders a div', () => {
    const divs = agentInfoPage().find('div');
    expect(divs).to.have.lengthOf.above(0);
  });

  it('receives the agent url from the store', () => {
    testStore.dispatch({
      type: 'AGENT_INFO_SUCCESS',
      info: { url: 'http://localhost:3000' }
    });

    const links = agentInfoPage().find('a');

    expect(
      links.filterWhere(link => link.prop('href') === 'http://localhost:3000')
    ).to.have.lengthOf.above(0);
  });
});
