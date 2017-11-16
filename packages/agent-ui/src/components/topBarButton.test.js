import React from 'react';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { TopBarButton } from './topBarButton';

chai.use(sinonChai);

describe('<TopBarButton />', () => {
  const requiredProps = {
    agent: 'agent',
    process: 'process',
    text: 'much button',
    openDialog: () => {},
    classes: { topBarButton: '' }
  };

  it('contains the input text', () => {
    const button = mount(<TopBarButton {...requiredProps} />);
    expect(button.find('Typography')).to.have.length(1);
    expect(button.find('Typography').text()).to.equal(requiredProps.text);
  });

  it('opens dialog with agent and process when clicked', () => {
    const openDialogSpy = sinon.spy();
    const button = mount(
      <TopBarButton {...requiredProps} openDialog={openDialogSpy} />
    );

    button.find('button').simulate('click');
    expect(openDialogSpy.callCount).to.equal(1);
    expect(openDialogSpy.getCall(0).args).to.deep.equal(['agent', 'process']);
  });
});
