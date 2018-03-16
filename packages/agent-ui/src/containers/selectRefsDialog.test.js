import React from 'react';
import { Provider } from 'react-redux';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import configureStore from 'redux-mock-store';

import { TestStateBuilder } from '../test/builders/state';

import SelectRefsDialogContainer, {
  SelectRefsDialog
} from './selectRefsDialog';

chai.use(sinonChai);

describe('<SelectRefsDialog />', () => {
  const testState = new TestStateBuilder().build();
  const mockStore = configureStore();
  const store = mockStore(testState);

  let requiredProps;

  beforeEach(() => {
    requiredProps = {
      appendRef: sinon.spy(),
      closeDialog: sinon.spy(),
      fetchSegments: sinon.spy(),
      process: 'proc',
      processes: ['proc', 'anotherProc'],
      agent: 'agent',
      show: true,
      segments: {}
    };
  });

  it('renders null if show is false', () => {
    const dialog = shallow(
      <SelectRefsDialog {...requiredProps} show={false} />
    );
    expect(dialog.getElement()).to.equal(null);
  });

  it('searches for all segments when show changes from false to true', () => {
    const dialog = shallow(
      <SelectRefsDialog {...requiredProps} show={false} />
    );
    expect(requiredProps.fetchSegments.callCount).to.equal(0);
    dialog.setProps({ show: true });
    expect(requiredProps.fetchSegments.callCount).to.equal(1);
    expect(requiredProps.fetchSegments.getCall(0).args).to.deep.equal([
      'agent',
      'proc',
      { process: 'proc' }
    ]);
    dialog.setProps({ show: false });
    expect(requiredProps.fetchSegments.callCount).to.equal(1);
  });

  it('gets the segments when using submitfilters', () => {
    const testFilters = {
      mapId: '1234'
    };
    const dialog = shallow(<SelectRefsDialog {...requiredProps} />);
    dialog.instance().submitFilters(testFilters);
    expect(requiredProps.fetchSegments.callCount).to.equal(1);
    expect(requiredProps.fetchSegments.getCall(0).args).to.deep.equal([
      'agent',
      'proc',
      testFilters
    ]);
  });

  it('gets the segments from a different process', () => {
    const testFilters = {
      mapId: '1234',
      process: 'anotherProcess'
    };
    const dialog = shallow(<SelectRefsDialog {...requiredProps} />);
    dialog.instance().submitFilters(testFilters);
    expect(requiredProps.fetchSegments.callCount).to.equal(1);
    expect(requiredProps.fetchSegments.getCall(0).args).to.deep.equal([
      'agent',
      'anotherProcess',
      testFilters
    ]);
  });

  it('correctly adds a ref when using addSegmentAsRef', () => {
    const testSegment = {
      link: { meta: { process: 'iamprocess', mapId: 'mapId' } },
      meta: { linkHash: 'bighash' },
      junk: { test: 'test' }
    };
    const expectedRef = {
      process: 'iamprocess',
      linkHash: 'bighash',
      mapId: 'mapId',
      segment: { link: testSegment.link, meta: testSegment.meta }
    };
    const dialog = shallow(<SelectRefsDialog {...requiredProps} />);
    dialog.instance().addSegmentAsRef(testSegment);
    expect(requiredProps.appendRef.callCount).to.equal(1);
    expect(requiredProps.appendRef.getCall(0).args).to.deep.equal([
      expectedRef
    ]);
  });

  it('closes the dialog when clicking outside of the dialog', () => {
    const dialog = mount(
      <Provider store={store}>
        <SelectRefsDialog {...requiredProps} />
      </Provider>
    );
    const backdrop = dialog.find('Backdrop');
    expect(backdrop).to.have.length(1);
    backdrop.simulate('click');
    expect(requiredProps.closeDialog.callCount).to.equal(1);
  });

  it('closes the dialog when clicking the done button', () => {
    const dialog = mount(
      <Provider store={store}>
        <SelectRefsDialog {...requiredProps} />
      </Provider>
    );
    const doneButton = dialog.find('DialogActions').find('Button');
    expect(doneButton).to.have.length(1);
    doneButton.simulate('click');
    expect(requiredProps.closeDialog.callCount).to.equal(1);
  });
});

describe('<SelectRefsDialogContainer />', () => {
  it('filters alreay selected segments from the segments list', () => {
    const selectedSegment = { meta: { linkHash: '42' } };
    const availableSegment = { meta: { linkHash: '43' } };

    const testState = new TestStateBuilder()
      .withSelectedRef({ linkHash: '42' })
      .withSegment(selectedSegment)
      .withSegment(availableSegment)
      .build();
    const mockStore = configureStore();
    const store = mockStore(testState);

    const ownProps = { location: { pathname: '' } };

    const dialog = shallow(
      <SelectRefsDialogContainer store={store} {...ownProps} />
    );
    expect(dialog.props().segments.details).to.have.length(1);
    expect(dialog.props().segments.details[0]).to.equal(availableSegment);
  });
});
