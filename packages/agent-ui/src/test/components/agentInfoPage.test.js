import React from 'react';

import { mount } from 'enzyme';
import { expect } from 'chai';

import { AgentInfoPage } from '../../components/agentInfoPage';

describe('<AgentInfoPage />', () => {
  it('always renders a div', () => {
    const agentInfoPage = mount(<AgentInfoPage agentUrl="ignored" />);
    const divs = agentInfoPage.find('div');
    expect(divs).to.have.lengthOf.above(0);
  });

  it('receives the agent url from the store', () => {
    const agentInfoPage = mount(
      <AgentInfoPage agentUrl="http://localhost:3000" />
    );
    const links = agentInfoPage.find('a');
    expect(
      links.filterWhere(link => link.prop('href') === 'http://localhost:3000')
    ).to.have.lengthOf.above(0);
  });
});
