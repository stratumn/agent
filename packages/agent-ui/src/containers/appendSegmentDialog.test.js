import React from 'react';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as statusTypes from '../constants/status';

import { AppendSegmentDialog, mapStateToProps } from './appendSegmentDialog';

chai.use(sinonChai);

describe('<AppendSegmentDialog />', () => {
  const requiredProps = {
    show: true,
    closeDialog: () => {}
  };

  it('learns to show dialog from state', () => {
    const props = mapStateToProps({
      appendSegment: { dialog: { show: true } }
    });
    expect(props).to.deep.equal({ show: true });
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
});
