import React from 'react';
import { Provider } from 'react-redux';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import configureStore from 'redux-mock-store';

import { TestStateBuilder } from '../test/builders/state';

import * as statusTypes from '../constants/status';

import { CreateMapDialog, mapStateToProps } from './createMapDialog';

chai.use(sinonChai);

describe('<CreateMapDialog />', () => {
  const requiredProps = {
    show: true,
    args: ['title'],
    error: '',
    createMap: () => {},
    closeDialog: () => {}
  };

  const testState = new TestStateBuilder().build();
  const mockStore = configureStore();
  const store = mockStore(testState);

  it('learns to show dialog from state', () => {
    const props = mapStateToProps({
      createMap: { dialog: { show: true, args: ['title'] } }
    });
    expect(props).to.deep.equal({ show: true, args: ['title'], error: '' });
  });

  it('does not show dialog if state missing', () => {
    const props = mapStateToProps({});
    expect(props).to.deep.equal({ show: false, args: [], error: '' });
  });

  it('extracts error from state', () => {
    const props = mapStateToProps({
      createMap: {
        dialog: { show: true },
        request: { status: statusTypes.FAILED, error: 'err!!!' }
      }
    });
    expect(props.error).to.equal('err!!!');
  });

  it('only extracts error from state if status if failed', () => {
    const props = mapStateToProps({
      createMap: {
        dialog: { show: true },
        request: { status: statusTypes.LOADING, error: 'err!!!' }
      }
    });
    expect(props.error).to.equal('');
  });

  it('does not show if it should not', () => {
    const dialog = shallow(<CreateMapDialog {...requiredProps} show={false} />);
    expect(dialog.children()).to.have.length(0);
  });

  it('provides a button to close dialog', () => {
    const closeDialogSpy = sinon.spy();
    const dialog = mount(
      <Provider store={store}>
        <CreateMapDialog {...requiredProps} closeDialog={closeDialogSpy} />
      </Provider>
    );

    const closeButton = dialog.find('Button').at(0);
    closeButton.simulate('click');
    expect(closeDialogSpy.callCount).to.equal(1);
  });

  it('creates map with init method arguments', () => {
    const createMapSpy = sinon.spy();
    const dialog = mount(
      <Provider store={store}>
        <CreateMapDialog
          {...requiredProps}
          args={['title', 'version']}
          createMap={createMapSpy}
        />
      </Provider>
    );

    expect(dialog.find('TextField')).to.have.length(2);
    const titleInput = dialog.find('TextField').at(0);
    const versionInput = dialog.find('TextField').at(1);

    expect(titleInput.props().label).to.equal('title');
    expect(versionInput.props().label).to.equal('version');

    titleInput.find('input').simulate('change', {
      target: { value: '    maps are awesome    ' }
    });
    versionInput.find('input').simulate('change', {
      target: { value: '42' }
    });

    dialog
      .find('Button')
      .at(1)
      .simulate('click');
    expect(createMapSpy.callCount).to.equal(1);
    expect(createMapSpy.getCall(0).args).to.deep.equal([
      'maps are awesome',
      '42'
    ]);
  });

  it('displays error message if creating map fails', () => {
    const dialog = mount(
      <Provider store={store}>
        <CreateMapDialog {...requiredProps} error="Invalid title" />
      </Provider>
    );

    expect(dialog.find('DialogContentText')).to.have.length(1);
    expect(dialog.find('DialogContentText').text()).to.equal('Invalid title');
  });
});
