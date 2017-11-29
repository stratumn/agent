import React from 'react';
import { Provider } from 'react-redux';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import configureStore from 'redux-mock-store';

import * as statusTypes from '../constants/status';

import { TestProcessBuilder, TestStateBuilder } from '../test/builders/state';

import { AppendSegmentDialog, mapStateToProps } from './appendSegmentDialog';

chai.use(sinonChai);

describe('<AppendSegmentDialog />', () => {
  const testActions = new TestProcessBuilder('p')
    .withAction('a1', ['a1_1', 'a1_2'])
    .withAction('a2', ['a2_1', 'a2_2', 'a2_3'])
    .build().actions;

  const testState = new TestStateBuilder().build();
  const mockStore = configureStore();
  const store = mockStore(testState);

  const requiredProps = {
    show: true,
    actions: testActions,
    selectedAction: 'a2',
    appendSegment: () => {},
    closeDialog: () => {},
    selectAction: () => {}
  };

  it('learns to show dialog from state', () => {
    const props = mapStateToProps({
      appendSegment: {
        dialog: { show: true, actions: testActions, selectedAction: 'a2' }
      }
    });
    expect(props).to.deep.equal({
      show: true,
      actions: testActions,
      selectedAction: 'a2'
    });
  });

  it('does not show dialog if state missing', () => {
    const props = mapStateToProps({});
    expect(props).to.deep.equal({ show: false });
  });

  it('extracts error from state', () => {
    const props = mapStateToProps({
      appendSegment: {
        dialog: { show: true },
        request: { status: statusTypes.FAILED, error: 'err!!!' }
      }
    });
    expect(props.error).to.equal('err!!!');
  });

  it('only extracts error from state if status is failed', () => {
    const props = mapStateToProps({
      appendSegment: {
        dialog: { show: true },
        request: { status: statusTypes.LOADING, error: 'err!!!' }
      }
    });
    expect(props.error).to.be.undefined;
  });

  it('does not show if it should not', () => {
    const dialog = shallow(
      <AppendSegmentDialog {...requiredProps} show={false} />
    );
    expect(dialog.children()).to.have.length(0);
  });

  it('provides a button to close dialog', () => {
    const closeDialogSpy = sinon.spy();
    const dialog = mount(
      <Provider store={store}>
        <AppendSegmentDialog {...requiredProps} closeDialog={closeDialogSpy} />
      </Provider>
    );
    const closeButton = dialog.find('Button').at(0);
    closeButton.simulate('click');
    expect(closeDialogSpy.callCount).to.equal(1);
  });

  it('provides a dropdown to select action', () => {
    const dialog = mount(
      <Provider store={store}>
        <AppendSegmentDialog {...requiredProps} />
      </Provider>
    );
    const dropdown = dialog.find('Select');
    expect(dropdown).to.have.length(1);
    expect(dropdown.find('input').props().value).to.equal('a2');
  });

  it('provides input fields for selected action arguments', () => {
    const dialog = mount(
      <Provider store={store}>
        <AppendSegmentDialog {...requiredProps} />
      </Provider>
    );

    const actionFields = dialog.find('TextField');
    expect(actionFields).to.have.length(3);
    expect(actionFields.at(0).props().label).to.equal('a2_1');
    expect(actionFields.at(1).props().label).to.equal('a2_2');
    expect(actionFields.at(2).props().label).to.equal('a2_3');
  });

  it('dispatches an action when selection changes', () => {
    const selectActionSpy = sinon.spy();
    const dialog = mount(
      <Provider store={store}>
        <AppendSegmentDialog
          {...requiredProps}
          selectAction={selectActionSpy}
        />
      </Provider>
    );

    const dropdown = dialog.find('Select');
    dropdown.props().onChange({ target: { value: 'a1' } });

    expect(selectActionSpy.callCount).to.equal(1);
    expect(selectActionSpy.getCall(0).args).to.deep.equal(['a1']);
  });

  it('appends a new segment on button click', () => {
    const appendSegmentSpy = sinon.spy();
    const dialog = mount(
      <Provider store={store}>
        <AppendSegmentDialog
          {...requiredProps}
          selectedAction="a1"
          appendSegment={appendSegmentSpy}
        />
      </Provider>
    );

    const actionFields = dialog.find('TextField');
    expect(actionFields).to.have.length(2);

    actionFields
      .at(0)
      .find('input')
      .simulate('change', { target: { value: 'very' } });
    actionFields
      .at(1)
      .find('input')
      .simulate('change', { target: { value: 'wow' } });

    dialog
      .find('Button')
      .at(1)
      .simulate('click');

    expect(appendSegmentSpy.callCount).to.equal(1);
    expect(appendSegmentSpy.getCall(0).args).to.deep.equal(['very', 'wow']);
  });
});
