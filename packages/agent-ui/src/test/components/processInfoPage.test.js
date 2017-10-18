import React from 'react';

import { mount } from 'enzyme';
import { expect } from 'chai';
import { TestProcessBuilder, TestStateBuilder } from '../builders';

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
    const testProcess = new TestProcessBuilder('test').build();

    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find('h1').text()).to.equal('test');
  });

  it('renders actions details and forwards properties', () => {
    const testProcess = new TestProcessBuilder('test')
      .withAction('init', ['title'])
      .withAction('beAwesome', ['why', 'how'])
      .build();

    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find(ActionsSection)).to.have.length(1);

    const actionsProps = processInfoPage.find(ActionsSection).props().actions;
    expect(actionsProps).to.deep.equal(testProcess.processInfo.actions);
  });

  it('renders store details and forwards properties', () => {
    const testProcess = new TestProcessBuilder('test')
      .withStoreAdapter('dummyStore', 'v0.42.0', 'abcdef16', 'my awesome store')
      .build();

    const processInfoPage = mount(<ProcessInfoPage process={testProcess} />);
    expect(processInfoPage.find(StoreSection)).to.have.length(1);

    const storeProps = processInfoPage.find(StoreSection).props().storeAdapter;
    expect(storeProps).to.deep.equal(testProcess.storeInfo.adapter);
  });

  it('renders fossilizers details and forwards properties', () => {
    const testProcess = new TestProcessBuilder('test')
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
    const awesomeProcess = new TestProcessBuilder('awesome').build();
    const mehProcess = new TestProcessBuilder('meh').build();

    const testState = new TestStateBuilder()
      .withProcess(awesomeProcess)
      .withProcess(mehProcess)
      .build();

    const routeParams = { match: { params: { process: 'meh' } } };
    const mappedProps = mapStateToProps(testState, routeParams);

    expect(mappedProps.process).to.deep.equal(mehProcess);
  });
});

describe('<StoreSection />', () => {
  it('renders the store adapter name', () => {
    const testProcess = new TestProcessBuilder('test')
      .withStoreAdapter('dummyStore', 'v0.42.0', 'abcdef16', 'my awesome store')
      .build();

    const storeSection = mount(
      <StoreSection storeAdapter={testProcess.storeInfo.adapter} />
    );

    const storeNameSection = storeSection
      .find('Typography')
      .filterWhere(text => text.text() === 'dummyStore');
    expect(storeNameSection).to.have.length(1);
  });
});

describe('<ActionsSection />', () => {
  it('correctly displays actions signature', () => {
    const testProcess = new TestProcessBuilder('test')
      .withAction('greet', ['name'])
      .withAction('send', ['from', 'to'])
      .build();

    const actionsSection = mount(
      <ActionsSection actions={testProcess.processInfo.actions} />
    );

    const actionItems = actionsSection.find('ListItemText');
    expect(actionItems).to.have.length(2);
    expect(actionItems.at(0).text()).to.equal('greet(name)');
    expect(actionItems.at(1).text()).to.equal('send(from, to)');
  });
});

describe('<FossilizersSection />', () => {
  it('displays a custom message when no fossilizers are connected', () => {
    const testProcess = new TestProcessBuilder('no fossilizers').build();

    const fossilizersSection = mount(
      <FossilizersSection fossilizers={testProcess.fossilizersInfo} />
    );

    expect(
      fossilizersSection
        .find('p')
        .filterWhere(
          p => p.text() === 'Your agent is not connected to fossilizers.'
        )
    ).to.have.length(1);
  });

  it("displays fossilizers' details", () => {
    const testProcess = new TestProcessBuilder('with fossilizers')
      .withFossilizer('btcFoss', 'v42', 'ab45de56', 'btc fossilizer', 'btc')
      .withFossilizer('ethFoss', 'v42.1', 'abcabcde', 'evm fossilizer', 'evm')
      .build();

    const fossilizersSection = mount(
      <FossilizersSection fossilizers={testProcess.fossilizersInfo} />
    );

    const fossilizerItems = fossilizersSection.find('li');
    expect(fossilizerItems).to.have.length(2);
    expect(fossilizerItems.at(0).text()).to.contain('btcFoss');
    expect(fossilizerItems.at(1).text()).to.contain('ethFoss');
  });
});
