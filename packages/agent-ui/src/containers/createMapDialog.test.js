import React from 'react';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { CreateMapDialog, mapStateToProps } from './createMapDialog';

chai.use(sinonChai);

describe('<CreateMapDialog />', () => {
  it('learns to show dialog from state', () => {
    const props = mapStateToProps({ createMap: { showDialog: true } });
    expect(props).to.deep.equal({ show: true });
  });

  it('does not show dialog if state missing', () => {
    const props = mapStateToProps({});
    expect(props).to.deep.equal({ show: false });
  });

  it('extracts error from state', () => {
    const props = mapStateToProps({
      createMap: { showDialog: true, error: 'err!!!' }
    });
    expect(props.error).to.equal('err!!!');
  });

  it('does not show if it should not', () => {
    const dialog = shallow(<CreateMapDialog show={false} />);
    expect(dialog.children()).to.have.length(0);
  });

  it('provides a button to close dialog', () => {
    const closeDialogSpy = sinon.spy();
    const dialog = mount(<CreateMapDialog show closeDialog={closeDialogSpy} />);
    const closeButton = dialog.find('button').at(0);
    closeButton.simulate('click');
    expect(closeDialogSpy.callCount).to.equal(1);
  });

  it('provides a button to create a new map', () => {
    const createMapSpy = sinon.spy();
    const dialog = mount(<CreateMapDialog show createMap={createMapSpy} />);

    const mapTitle = dialog.find('input').at(0);
    mapTitle.instance().value = 'maps are awesome';

    dialog.find('form').simulate('submit');
    expect(createMapSpy.callCount).to.equal(1);
  });

  it('displays error message if creating map fails', () => {
    const dialog = shallow(<CreateMapDialog show error="Invalid title" />);
    expect(dialog.find('.error')).to.have.length(1);
    expect(dialog.find('.error').text()).to.equal('Invalid title');
  });
});
