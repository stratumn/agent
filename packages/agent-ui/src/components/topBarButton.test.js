import React from 'react';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { TopBarButton } from './topBarButton';

chai.use(sinonChai);

describe('<TopBarButton />', () => {
  const requiredProps = {
    text: 'much button',
    openDialog: () => {},
    classes: { topBarButton: '' }
  };

  it('contains the input text', () => {
    const button = mount(<TopBarButton {...requiredProps} />);
    expect(button.find('Button')).to.have.length(1);
    expect(button.find('Button').text()).to.equal(requiredProps.text);
  });

  it('opens dialog when clicked', () => {
    const openDialogSpy = sinon.spy();
    const button = mount(
      <TopBarButton {...requiredProps} openDialog={openDialogSpy} />
    );

    button.find('button').simulate('click');
    expect(openDialogSpy.callCount).to.equal(1);
  });
});
