import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { SegmentsFilter } from './segmentsFilter';

chai.use(sinonChai);

describe('<SegmentsFilter />', () => {
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
  });

  it('renders the filters correctly', () => {
    const segmentsFilter = renderComponent({});
    expect(segmentsFilter.find('Table')).to.have.lengthOf(1);
    expect(segmentsFilter.find('TextField')).to.have.lengthOf(3);
  });

  it('submit empty filters on clear', () => {
    const props = {
      filters: { abc: 1 }
    };
    const segmentsFilter = renderComponent(props);
    const clearButton = segmentsFilter.find('Button[type="clear"]');
    expect(clearButton).to.have.lengthOf(1);
    clearButton.simulate('click');
    expect(submitSpy.callCount).to.equal(1);
    expect(submitSpy.getCall(0).args[0]).to.deep.equal({});
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

    expect(segmentsFilter.find('Button')).to.have.length(2);
    expect(segmentsFilter.find('TextField')).to.have.length(3);
  });

  it('pushes the pathname with querystring on submit', () => {
    const props = {
      filters: {
        mapIds: ['aaa', 'bbb'],
        prevLinkHash: 'xyz',
        tags: ['foo', 'bar']
      }
    };
    const segmentsFilter = renderComponent(props);

    const submitButton = segmentsFilter.find('Button[type="filter"]');
    expect(submitButton).to.have.lengthOf(1);
    submitButton.simulate('click');
    expect(submitSpy.callCount).to.equal(1);
    expect(submitSpy.getCall(0).args[0]).to.deep.equal(props.filters);
  });

  it('handles change of input correctly', () => {
    const segmentsFilter = renderComponent({});

    const changes = ['  aa bb  ', '  xyz  ', '  foo bar  '];

    textFieldSelectors.forEach((selector, idx) =>
      segmentsFilter
        .find(selector)
        .find('input')
        .simulate('change', { target: { value: changes[idx] } })
    );

    segmentsFilter.find('Button[type="filter"]').simulate('click');
    expect(submitSpy.getCall(0).args[0]).to.deep.equal({
      mapIds: ['aa', 'bb'],
      prevLinkHash: 'xyz',
      tags: ['foo', 'bar']
    });
  });
});
