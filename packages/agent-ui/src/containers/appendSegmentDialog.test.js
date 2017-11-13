import React from 'react';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as statusTypes from '../constants/status';

import { TestProcessBuilder } from '../test/builders/state';

import { AppendSegmentDialog, mapStateToProps } from './appendSegmentDialog';

chai.use(sinonChai);

describe('<AppendSegmentDialog />', () => {
  const testActions = new TestProcessBuilder('p')
    .withAction('a1', ['a1_1', 'a1_2'])
    .withAction('a2', ['a2_1', 'a2_2', 'a2_3'])
    .build().actions;

  const requiredProps = {
    show: true,
    actions: testActions,
    selectedAction: 'a2',
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
      <AppendSegmentDialog {...requiredProps} closeDialog={closeDialogSpy} />
    );
    const closeButton = dialog.find('button').at(0);
    closeButton.simulate('click');
    expect(closeDialogSpy.callCount).to.equal(1);
  });

  it('provides a dropdown to select action', () => {
    const dialog = shallow(<AppendSegmentDialog {...requiredProps} />);
    const actions = dialog.find('select');
    expect(actions.children()).to.have.length(2);
    expect(actions.childAt(0).text()).to.equal('a1');
    expect(actions.childAt(1).text()).to.equal('a2');
  });

  it('provides inputs for selected action arguments', () => {
    const dialog = shallow(<AppendSegmentDialog {...requiredProps} />);

    const actions = dialog.find('select');
    expect(actions.props().value).to.equal('a2');

    const actionInputs = dialog.find('input');
    expect(actionInputs).to.have.length(3);
    expect(actionInputs.at(0).props().placeholder).to.equal('a2_1');
    expect(actionInputs.at(1).props().placeholder).to.equal('a2_2');
    expect(actionInputs.at(2).props().placeholder).to.equal('a2_3');
  });

  it('dispatches an action when selection changes', () => {
    const selectActionSpy = sinon.spy();
    const dialog = mount(
      <AppendSegmentDialog {...requiredProps} selectAction={selectActionSpy} />
    );

    const actions = dialog.find('select');
    actions.simulate('change', { target: { value: 'a1' } });

    expect(selectActionSpy.callCount).to.equal(1);
    expect(selectActionSpy.getCall(0).args).to.deep.equal(['a1']);
  });
});
