import React from 'react';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { SignedAttributes } from './signedAttributes';

chai.use(sinonChai);

describe('<SignedAttributes />', () => {
  const allowedAttributes = {
    inputs: true,
    action: true
  };
  const userKey = {
    secret: new Uint8Array(0),
    public: 'public',
    type: 'type'
  };

  const requiredProps = {
    updateSignedAttributes: () => {}
  };

  it('disables the input if no key is set', () => {
    const signedAttributes = mount(<SignedAttributes {...requiredProps} />);
    const switchOff = signedAttributes.find('Switch');
    expect(switchOff).to.have.length(1);
    expect(switchOff.prop('disabled')).to.be.true;
    const error = signedAttributes.find('FormControlLabel');
    expect(error.text()).to.equal(
      'You must import a key before signing segments'
    );
    expect(
      signedAttributes
        .find('FormGroup')
        .at(1)
        .find('FormControlLabel')
    ).to.have.length(0);
  });

  it('has the switch turned off by default', () => {
    const signedAttributes = mount(
      <SignedAttributes {...requiredProps} userKey={userKey} />
    );
    const switchOff = signedAttributes.find('Switch');
    expect(switchOff.prop('disabled')).to.be.false;
    expect(switchOff.prop('checked')).to.be.false;
    const signLabel = signedAttributes.find('FormControlLabel');
    expect(signLabel.text()).to.equal('Sign');
    expect(
      signedAttributes
        .find('FormGroup')
        .at(1)
        .find('FormControlLabel')
    ).to.have.length(0);
  });

  it('displays the attributes when the switch is on', () => {
    const signedAttributes = mount(
      <SignedAttributes {...requiredProps} userKey={userKey} />
    );
    signedAttributes.setState({ ...signedAttributes.state(), signed: true });
    expect(
      signedAttributes
        .find('FormGroup')
        .at(1)
        .find('FormControlLabel')
    ).to.have.length(4);
  });

  it('allows customization of the attributes to be signed', () => {
    const signedAttributes = mount(
      <SignedAttributes
        {...requiredProps}
        userKey={userKey}
        attributes={allowedAttributes}
      />
    );
    signedAttributes.setState({ ...signedAttributes.state(), signed: true });
    expect(
      signedAttributes
        .find('FormGroup')
        .at(1)
        .find('FormControlLabel')
    ).to.have.length(Object.keys(allowedAttributes).length);
  });
});
