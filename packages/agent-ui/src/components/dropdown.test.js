import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Dropdown from './dropdown';

chai.use(sinonChai);

describe('<Dropdown />', () => {
  const selectSpy = sinon.spy();

  const requiredProps = {
    label: 'yolo',
    onSelect: selectSpy,
    selected: 'zoulou',
    options: ['yankee', 'zoulou', 'pizza']
  };

  const renderComponent = props =>
    mount(<Dropdown {...requiredProps} {...props} />);

  it('renders the closed dropdown correctly', () => {
    const dropdown = renderComponent({});
    expect(dropdown.find('Typography')).to.have.lengthOf(1);
    expect(dropdown.find('Button')).to.have.lengthOf(1);
    expect(dropdown.find('Button')).to.have.lengthOf(1);
    expect(dropdown.find('Menu')).to.have.lengthOf(1);
    expect(dropdown.find('MenuItem')).to.have.lengthOf(0);
  });

  it('opens the dropdown', () => {
    const dropdown = renderComponent({});

    // when
    dropdown.find('Button').simulate('click');

    // then
    expect(dropdown.find('Menu')).to.have.lengthOf(1);
    expect(dropdown.find('MenuItem')).to.have.lengthOf(3);
    expect(dropdown.state('anchorEl')).to.not.equal(null);
  });

  it('selects item and closes the dropdown', () => {
    const dropdown = renderComponent({});

    // when
    dropdown.find('Button').simulate('click');
    const option = dropdown.find('MenuItem').first();
    option.simulate('click');

    // then
    expect(selectSpy.callCount).to.equal(1);
    expect(selectSpy.getCall(0).args).to.deep.equal([option.text()]);
    expect(dropdown.state('anchorEl')).to.equal(null);
  });
});
