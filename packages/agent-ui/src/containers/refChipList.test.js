import React from 'react';
import { Provider } from 'react-redux';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { RefChipList } from './refChipList';

chai.use(sinonChai);

describe('<RefChipList />', () => {
  let requiredProps;
  const testRefs = [
    { process: 'a', linkHash: 'b' },
    { process: 'c', linkHash: 'd' }
  ];

  beforeEach(() => {
    requiredProps = {
      openDialog: sinon.spy(),
      deleteRef: sinon.spy(),
      deleteAllRefs: sinon.spy(),
      refs: [],
      classes: {
        row: '',
        chip: ''
      }
    };
  });

  it('renders text propt when no refs are present', () => {
    const chipList = mount(<RefChipList {...requiredProps} />);
    expect(chipList.find('Typography')).to.have.length(1);
    expect(chipList.find('Typography').text()).to.equal(
      'Add segments as refs...'
    );
  });

  it('renders 2 refs', () => {
    requiredProps.refs = testRefs;
    const chipList = mount(<RefChipList {...requiredProps} />);
    expect(chipList.find('Typography')).to.have.length(0);
    expect(chipList.find('Chip')).to.have.length(2);
  });

  it('it deletes the ref of the clicked x', () => {
    requiredProps.refs = testRefs;
    const chipList = mount(<RefChipList {...requiredProps} />);
    chipList.find('Chip').forEach((chip, idx) => {
      const deleteButton = chip.find('Cancel');
      deleteButton.simulate('click');
      expect(requiredProps.deleteRef.callCount).to.equal(idx + 1);
      expect(requiredProps.deleteRef.getCall(idx).args[0]).to.deep.equal(
        testRefs[idx]
      );
    });
  });

  it('brings up ref selector screen when the plus button is pushed', () => {
    const chipList = mount(<RefChipList {...requiredProps} />);
    const addButton = chipList.find('Add');
    expect(addButton).to.have.length(1);
    addButton.simulate('click');
    expect(requiredProps.openDialog.callCount).to.equal(1);
  });

  it('hides the plus button when withOpenButton is false', () => {
    const chipList = mount(
      <RefChipList {...requiredProps} withOpenButton={false} />
    );
    expect(chipList.find('Add')).to.have.length(0);
    expect(chipList.find('IconButton')).to.have.length(1);
  });

  it('clears the chip list when the trash button is pressed', () => {
    const chipList = mount(<RefChipList {...requiredProps} />);
    const trashButton = chipList.find('Delete');
    trashButton.simulate('click');
    expect(requiredProps.deleteAllRefs.callCount).to.equal(1);
  });
});
