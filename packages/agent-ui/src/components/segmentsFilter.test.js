import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import SegmentsFilter from './segmentsFilter';

chai.use(sinonChai);

describe('<SegmentsFilter />', () => {
  const submitSpy = sinon.spy();
  const requiredProps = {
    filters: {},
    submitHandler: submitSpy
  };
  const renderComponent = props =>
    mount(<SegmentsFilter {...requiredProps} {...props} />);

  beforeEach(() => {
    submitSpy.reset();
  });

  it('renders the form correctly', () => {
    const segmentsFilter = renderComponent({});
    expect(segmentsFilter.find('form')).to.have.lengthOf(1);
    expect(segmentsFilter.find('input')).to.have.lengthOf(3);
  });

  it('submit empty filters on clear', () => {
    const props = {
      filters: { abc: 1 }
    };
    const segmentsFilter = renderComponent(props);
    const clearButton = segmentsFilter.find('[type="clear"]');
    expect(clearButton).to.have.lengthOf(1);
    clearButton.simulate('click');
    expect(submitSpy.callCount).to.equal(1);
    expect(submitSpy.getCall(0).args[0]).to.deep.equal({});
  });

  it('disregards irrelevant filters', () => {
    const props = {
      filters: { abc: 1, foo: 'bar' }
    };
    const segmentsFilter = renderComponent(props);

    const selectors = ['Map IDs', 'Prev link hash', 'Tags'].map(
      s => `[placeholder="${s}"]`
    );

    selectors.forEach(selector => {
      const input = segmentsFilter.find(selector);
      expect(input).to.have.lengthOf(1);
      expect(input.props().value).to.be.equal('');
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

    const selectors = ['Map IDs', 'Prev link hash', 'Tags'].map(
      s => `[placeholder="${s}"]`
    );
    const expected = ['aaa bbb', 'xyz', 'foo bar'];

    selectors.forEach((selector, idx) => {
      const input = segmentsFilter.find(selector);
      expect(input).to.have.lengthOf(1);
      expect(input.props().value).to.be.equal(expected[idx]);
    });
  });

  it('does not fail when search has wrong format', () => {
    const props = {
      filters: { mapIds: 'aaa' } // this is invalid because not an array
    };
    expect(renderComponent(props)).to.have.lengthOf(1);
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

    const submitButton = segmentsFilter.find('[type="submit"]');
    expect(submitButton).to.have.lengthOf(1);
    submitButton.simulate('submit');
    expect(submitSpy.callCount).to.equal(1);
    expect(submitSpy.getCall(0).args[0]).to.deep.equal(props.filters);
  });

  it('handles change of input correctly', () => {
    const segmentsFilter = renderComponent({});

    const selectors = ['Map IDs', 'Prev link hash', 'Tags'].map(
      s => `[placeholder="${s}"]`
    );
    const changes = ['  aa bb  ', '  xyz  ', '  foo bar  '];

    selectors.forEach((selector, idx) =>
      segmentsFilter
        .find(selector)
        .simulate('change', { target: { value: changes[idx] } })
    );

    segmentsFilter.find('[type="submit"]').simulate('submit');
    expect(submitSpy.getCall(0).args[0]).to.deep.equal({
      mapIds: ['aa', 'bb'],
      prevLinkHash: 'xyz',
      tags: ['foo', 'bar']
    });
  });
});
