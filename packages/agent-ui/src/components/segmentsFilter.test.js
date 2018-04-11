import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { SegmentsFilter } from './segmentsFilter';
import * as hashUtils from '../utils/hashUtils';
import * as validateUUID from '../utils/uuidUtils';

chai.use(sinonChai);

describe('<SegmentsFilter />', () => {
  let validateHashStub;
  let validateUUIDStub;
  const submitSpy = sinon.spy();
  const requiredProps = {
    filters: {},
    submitHandler: submitSpy,
    classes: { tableFilter: '' }
  };
  const renderComponent = props =>
    mount(<SegmentsFilter {...requiredProps} {...props} />);

  const textFieldSelectors = ['Map IDs', 'Prev link hash', 'Tags'].map(
    s => `[label="${s}"]`
  );

  // valArr should be expected values following ['Map IDs', 'Prev link hash', 'Tags']
  const testTextFieldValues = (valArr, component) => {
    textFieldSelectors.forEach((selector, idx) => {
      const input = component.find(selector);
      expect(input).to.have.lengthOf(1);
      expect(input.props().value).to.be.equal(valArr[idx]);
    });
  };

  beforeEach(() => {
    submitSpy.reset();
    validateHashStub = sinon.stub(hashUtils, 'validateHash');
    validateHashStub.returns(true);

    validateUUIDStub = sinon.stub(validateUUID, 'default');
    validateUUIDStub.returns(true);
  });

  afterEach(() => {
    validateHashStub.restore();
    validateUUIDStub.restore();
  });

  it('renders the filters correctly', () => {
    const segmentsFilter = renderComponent({});
    expect(segmentsFilter.find('Table')).to.have.lengthOf(1);
    expect(segmentsFilter.find('TextField')).to.have.lengthOf(3);
  });

  it('submit empty filters on clear', () => {
    const props = {
      filters: { prevLinkHash: 'test' }
    };
    const segmentsFilter = renderComponent(props);
    const clearButton = segmentsFilter.find('Button[type="clear"]');
    expect(clearButton).to.have.lengthOf(1);
    clearButton.simulate('click');
    expect(submitSpy.callCount).to.equal(1);
    expect(submitSpy.getCall(0).args[0]).to.deep.equal({
      process: undefined,
      mapIds: undefined,
      prevLinkHash: undefined,
      tags: undefined
    });
  });

  it('clears the text fields on clear', () => {
    const props = {
      filters: {
        mapIds: ['a'],
        prevLinkHash: 'b',
        tags: ['c']
      }
    };
    const segmentsFilter = renderComponent(props);
    const expected1 = ['a', 'b', 'c'];
    testTextFieldValues(expected1, segmentsFilter);
    const clearButton = segmentsFilter.find('Button[type="clear"]');
    expect(clearButton).to.have.lengthOf(1);
    clearButton.simulate('click');
    const expected2 = ['', '', ''];
    testTextFieldValues(expected2, segmentsFilter);
  });

  it('disregards irrelevant filters', () => {
    const props = {
      filters: { abc: 1, foo: 'bar' }
    };
    const segmentsFilter = renderComponent(props);

    textFieldSelectors.forEach(selector => {
      const input = segmentsFilter.find(selector);
      expect(input).to.have.lengthOf(1);
      expect(input.props().value).to.equal('');
    });
  });

  it('display filters correctly as default values', () => {
    const props = {
      filters: {
        mapIds: ['aaa', 'bbb'],
        prevLinkHash: 'xyz',
        tags: ['foo', 'bar']
      }
    };
    const segmentsFilter = renderComponent(props);

    const expected = ['aaa bbb', 'xyz', 'foo bar'];

    testTextFieldValues(expected, segmentsFilter);
  });

  it('does not fail when search has wrong format', () => {
    const props = {
      filters: { mapIds: 'aaa' } // this is invalid because not an array
    };
    const segmentsFilter = renderComponent(props);

    expect(submitSpy.callCount).to.equal(0);

    expect(segmentsFilter.find('Button')).to.have.length(1);
    expect(segmentsFilter.find('TextField')).to.have.length(3);
  });

  it('handles change of input correctly', () => {
    const segmentsFilter = renderComponent({ filters: {} });

    const changes = ['  aa bb  ', '  xyz  ', '  foo bar  '];
    textFieldSelectors.forEach((selector, idx) =>
      segmentsFilter
        .find(selector)
        .find('input')
        .simulate('change', { target: { value: changes[idx] } })
    );

    expect(submitSpy.callCount).to.equal(3);
    expect(submitSpy.getCall(0).args[0]).to.deep.equal({
      mapIds: ['aa', 'bb'],
      prevLinkHash: undefined,
      tags: undefined,
      process: undefined
    });
    expect(submitSpy.getCall(1).args[0]).to.deep.equal({
      mapIds: ['aa', 'bb'],
      prevLinkHash: 'xyz',
      tags: undefined,
      process: undefined
    });
    expect(submitSpy.getCall(2).args[0]).to.deep.equal({
      mapIds: ['aa', 'bb'],
      prevLinkHash: 'xyz',
      tags: ['foo', 'bar'],
      process: undefined
    });
  });

  it('disable filter button and show error when prevLinkHash not valid', () => {
    validateHashStub.returns(false);
    const props = {
      filters: {
        prevLinkHash: 'xyz'
      }
    };
    const segmentsFilter = renderComponent(props);
    const prevLinkHashFld = segmentsFilter.find('[label="Prev link hash"]');
    expect(prevLinkHashFld.props().error).to.be.true;
  });

  it('disable filter button and show error when mapID not valid', () => {
    // validateUUIDStub.returns(false);
    const props = {
      filters: {
        mapIds: 'xyz'
      }
    };
    const segmentsFilter = renderComponent(props);
    const mapIdsFld = segmentsFilter.find('[label="Map IDs"]');
    expect(mapIdsFld.props().error).to.be.true;
  });

  it('does not clear filters after changing input values', () => {
    const segmentsFilter = renderComponent();

    const inputValues = ['  aa bb  ', '  xyz  ', '  foo bar  '];

    textFieldSelectors.forEach((selector, idx) =>
      segmentsFilter
        .find(selector)
        .find('input')
        .simulate('change', { target: { value: inputValues[idx] } })
    );

    testTextFieldValues(inputValues, segmentsFilter);
  });

  it('updates the state on receiving props if filters is not empty', () => {
    const segmentsFilter = renderComponent();

    expect(segmentsFilter.state('tags')).to.equal(undefined);
    segmentsFilter.setProps({ filters: {} });
    expect(segmentsFilter.state('tags')).to.equal(undefined);
    segmentsFilter.setProps({ filters: { tags: ['a', 'b'] } });
    expect(segmentsFilter.state('tags')).to.equal('a b');
  });
});
