import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import history from '../store/history';
import { SegmentsFilter } from './segmentsFilter';

chai.use(sinonChai);

describe('<SegmentFilter />', () => {
  const renderComponent = props =>
    mount(
      <MemoryRouter>
        <SegmentsFilter {...props} />
      </MemoryRouter>
    );

  let historyStub;

  beforeEach(() => {
    historyStub = sinon.stub(history, 'push');
  });

  afterEach(() => {
    historyStub.restore();
  });

  it('renders the form correctly', () => {
    const props = {
      pathname: '',
      search: ''
    };
    const segmentsFilter = renderComponent(props);
    expect(segmentsFilter.find('form')).to.have.lengthOf(1);
    expect(segmentsFilter.find('input')).to.have.lengthOf(3);
  });

  it('pushes pathname to history on clear', () => {
    const props = {
      pathname: 'foobar',
      search: '?abc=1'
    };
    const segmentsFilter = renderComponent(props);
    const clearButton = segmentsFilter.find('[type="clear"]');
    expect(clearButton).to.have.lengthOf(1);
    clearButton.simulate('click');
    expect(historyStub.callCount).to.equal(1);
    expect(historyStub.getCall(0).args[0]).to.equal('foobar');
  });

  it('parses the search field and disregards irrelevant props', () => {
    const props = {
      pathname: 'foobar',
      search: '?abc=1&foo=bar'
    };
    const segmentsFilter = renderComponent(props);

    const selectors = ['Map IDs', 'Prev link hash', 'Tags'].map(
      s => `[placeholder="${s}"]`
    );

    selectors.forEach(selector => {
      const input = segmentsFilter.find(selector);
      expect(input).to.have.lengthOf(1);
      expect(input.props().defaultValue).to.be.undefined;
    });
  });

  it('parses the search field and display correctly as default values', () => {
    const props = {
      pathname: 'foobar',
      search:
        '?mapIds[]=aaa&mapIds[]=bbb&prevLinkHash=xyz&tags[]=foo&tags[]=bar'
    };
    const segmentsFilter = renderComponent(props);

    const selectors = ['Map IDs', 'Prev link hash', 'Tags'].map(
      s => `[placeholder="${s}"]`
    );
    const expected = ['aaa bbb', 'xyz', 'foo bar'];

    selectors.forEach((selector, idx) => {
      const input = segmentsFilter.find(selector);
      expect(input).to.have.lengthOf(1);
      expect(input.props().defaultValue).to.be.equal(expected[idx]);
    });
  });

  it('does not fail when search has wrong format', () => {
    const props = {
      pathname: 'foobar',
      search: '?mapIds=aaa' // this is invalid because not an array
    };
    expect(renderComponent(props)).to.have.lengthOf(1);
  });

  it('pushes the pathname with querystring on submit', () => {
    const props = {
      pathname: 'foobar',
      search:
        '?mapIds[]=aaa&mapIds[]=bbb&prevLinkHash=xyz&tags[]=foo&tags[]=bar'
    };
    const segmentsFilter = renderComponent(props);

    const submitButton = segmentsFilter.find('[type="submit"]');
    expect(submitButton).to.have.lengthOf(1);
    submitButton.simulate('submit');
    expect(historyStub.callCount).to.equal(1);
    expect(historyStub.getCall(0).args[0]).to.equal(
      'foobar?mapIds%5B%5D=aaa&mapIds%5B%5D=bbb&tags%5B%5D=foo&tags%5B%5D=bar&prevLinkHash=xyz'
    );
  });

  it('handles change of input correctly', () => {
    const props = {
      pathname: 'foobar',
      search: ''
    };
    const segmentsFilter = renderComponent(props);

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
    expect(historyStub.getCall(0).args[0]).to.equal(
      'foobar?mapIds%5B%5D=aa&mapIds%5B%5D=bb&tags%5B%5D=foo&tags%5B%5D=bar&prevLinkHash=xyz'
    );
  });
});
