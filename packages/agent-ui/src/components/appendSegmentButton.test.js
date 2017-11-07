import React from 'react';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import AppendSegmentButton from './appendSegmentButton';

chai.use(sinonChai);

describe('<AppendSegmentButton />', () => {
  it('opens dialog with agent, process and mapId when clicked', () => {
    const openDialogSpy = sinon.spy();
    const appendSegmentButton = mount(
      <AppendSegmentButton
        agent="a"
        process="p"
        id="m"
        openDialog={openDialogSpy}
      />
    );

    appendSegmentButton.find('button').simulate('click');
    expect(openDialogSpy.callCount).to.equal(1);
    expect(openDialogSpy.getCall(0).args).to.deep.equal(['a', 'p', 'm']);
  });
});
