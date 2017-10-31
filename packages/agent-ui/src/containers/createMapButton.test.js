import React from 'react';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { CreateMapButton } from './createMapButton';

chai.use(sinonChai);

describe('<CreateMapButton />', () => {
  it('opens dialog with agent and process when clicked', () => {
    const openDialogSpy = sinon.spy();
    const createMapButton = mount(
      <CreateMapButton agent="a" process="p" openDialog={openDialogSpy} />
    );

    createMapButton.find('button').simulate('click');
    expect(openDialogSpy.callCount).to.equal(1);
    expect(openDialogSpy.getCall(0).args).to.deep.equal(['a', 'p']);
  });
});
