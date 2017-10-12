import React from 'react';
import { Provider } from 'react-redux';

import { mount } from 'enzyme';
import { expect } from 'chai';

import {
  ProcessInfoPage,
  StoreSection,
  ActionsSection,
  FossilizersSection
} from '../../components/processInfoPage';

describe('<ProcessInfoPage />', () => {
  const testProcess = {
    name: 'test',
    processInfo: {
      actions: { init: { args: ['message'] } }
    },
    storeInfo: {
      adapter: {}
    }
  };

  it('renders a loading message while process info has not loaded', () => {
    const processInfoPage = mount(<ProcessInfoPage />);
    const loadingDiv = processInfoPage.find('div');
    expect(loadingDiv).to.have.length(1);
    expect(loadingDiv.text()).to.equal('Loading...');
  });

  it('displays the process name once loaded', () => {
    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find('h1').text()).to.equal('test');
  });

  it('renders actions details and forwards properties', () => {
    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find(ActionsSection)).to.have.length(1);
    expect(processInfoPage.find(ActionsSection).props().actions).to.deep.equal(
      testProcess.processInfo.actions
    );
  });

  it('renders store details and forwards properties', () => {
    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find(StoreSection)).to.have.length(1);
    expect(
      processInfoPage.find(StoreSection).props().storeAdapter
    ).to.deep.equal(testProcess.storeInfo.adapter);
  });

  it('renders fossilizers details and forwards properties', () => {
    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find(FossilizersSection)).to.have.length(1);
    expect(
      processInfoPage.find(FossilizersSection).props().fossilizers
    ).to.deep.equal(testProcess.fossilizersInfo);
  });
});
