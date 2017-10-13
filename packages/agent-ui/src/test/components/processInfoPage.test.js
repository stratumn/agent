import React from 'react';

import { mount } from 'enzyme';
import { expect } from 'chai';
import { TestProcess } from '../builders/testProcessBuilder';
import { TestState } from '../builders/testStateBuilder';

import {
  ProcessInfoPage,
  StoreSection,
  ActionsSection,
  FossilizersSection,
  mapStateToProps
} from '../../components/processInfoPage';

describe('<ProcessInfoPage />', () => {
  it('renders a loading message while process info has not loaded', () => {
    const processInfoPage = mount(<ProcessInfoPage />);
    const loadingDiv = processInfoPage.find('div');
    expect(loadingDiv).to.have.length(1);
    expect(loadingDiv.text()).to.equal('Loading...');
  });

  it('displays the process name once loaded', () => {
    const testProcess = new TestProcess.Builder('test').build();

    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find('h1').text()).to.equal('test');
  });

  it('renders actions details and forwards properties', () => {
    const testProcess = new TestProcess.Builder('test')
      .withAction('init', ['title'])
      .withAction('beAwesome', ['why', 'how'])
      .build();

    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find(ActionsSection)).to.have.length(1);

    const actionsProps = processInfoPage.find(ActionsSection).props().actions;
    expect(actionsProps).to.deep.equal(testProcess.processInfo.actions);
  });

  it('renders store details and forwards properties', () => {
    const testProcess = new TestProcess.Builder('test')
      .withStoreAdapter('dummyStore', 'v0.42.0', 'abcdef16', 'my awesome store')
      .build();

    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find(StoreSection)).to.have.length(1);

    const storeProps = processInfoPage.find(StoreSection).props().storeAdapter;
    expect(storeProps).to.deep.equal(testProcess.storeInfo.adapter);
  });

  it('renders fossilizers details and forwards properties', () => {
    const testProcess = new TestProcess.Builder('test')
      .withFossilizer(
        'btcFossilizer',
        'v42',
        '42424242',
        'bitcoin fossilizer',
        'btc'
      )
      .build();

    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find(FossilizersSection)).to.have.length(1);

    const fossilizersProps = processInfoPage.find(FossilizersSection).props()
      .fossilizers;
    expect(fossilizersProps).to.deep.equal(testProcess.fossilizersInfo);
  });

  it('extracts from store state the process chosen in the url', () => {
    const awesomeProcess = new TestProcess.Builder('awesome').build();
    const mehProcess = new TestProcess.Builder('meh').build();

    const testState = new TestState.Builder()
      .withProcess(awesomeProcess)
      .withProcess(mehProcess)
      .build();

    const routeParams = { params: { process: 'meh' } };
    const mappedProps = mapStateToProps(testState, routeParams);

    expect(mappedProps.process).to.deep.equal(mehProcess);
  });
});

describe('<StoreSection />', () => {
  it('renders the store adapter name', () => {
    const testProcess = new TestProcess.Builder('test')
      .withStoreAdapter('dummyStore', 'v0.42.0', 'abcdef16', 'my awesome store')
      .build();

    const storeSection = mount(
      <StoreSection storeAdapter={testProcess.storeInfo.adapter} />
    );

    const storeNameSection = storeSection
      .find('samp')
      .filterWhere(samp => samp.text() === 'dummyStore');
    expect(storeNameSection).to.have.length(1);
  });
});
