import React from 'react';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { ActionArgumentFields } from './actionArgumentFields';

chai.use(sinonChai);

describe('<ActionArgumentFields />', () => {
  const requiredProps = {
    args: ['much', 'awesome'],
    valueChanged: () => {}
  };

  it('contains one input per argument', () => {
    const wrapper = mount(<ActionArgumentFields {...requiredProps} />);

    const argFields = wrapper.find('TextField');
    expect(argFields).to.have.length(2);
    expect(argFields.at(0).text()).to.equal('much');
    expect(argFields.at(1).text()).to.equal('awesome');
  });

  it('notifies when argument value changes', () => {
    const valueChangedSpy = sinon.spy();
    const wrapper = mount(
      <ActionArgumentFields {...requiredProps} valueChanged={valueChangedSpy} />
    );

    const firstArgument = wrapper.find('TextField').at(0);
    firstArgument
      .find('input')
      .simulate('change', { target: { value: 'very wow' } });

    expect(valueChangedSpy.callCount).to.equal(1);
    expect(valueChangedSpy.getCall(0).args).to.deep.equal([0, 'very wow']);
  });
});
