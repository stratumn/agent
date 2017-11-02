import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { ProcessSegmentsPage } from './processSegmentsPage';
import { statusTypes } from '../reducers';

chai.use(sinonChai);

describe('<ProcessSegmentsPage />', () => {
  const renderComponent = props =>
    mount(
      <MemoryRouter>
        <ProcessSegmentsPage {...props} />
      </MemoryRouter>
    );

  it('calls fetch on mount', () => {
    const props = {
      fetchSegments: sinon.spy(),
      agent: '',
      process: '',
      segments: {}
    };
    const processSegmentsPage = renderComponent(props);
    expect(props.fetchSegments.callCount).to.equal(1);
    const div = processSegmentsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('process segments')).to.be.true;
  });

  it('renders on loading', () => {
    const props = {
      fetchSegments: sinon.spy(),
      agent: '',
      process: '',
      segments: { status: statusTypes.LOADING }
    };
    const processSegmentsPage = renderComponent(props);
    expect(props.fetchSegments.callCount).to.equal(1);
    const div = processSegmentsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('loading...')).to.be.true;
  });

  it('renders on failed', () => {
    const props = {
      fetchSegments: sinon.spy(),
      agent: '',
      process: '',
      segments: { status: statusTypes.FAILED, error: 'unreachable' }
    };
    const processSegmentsPage = renderComponent(props);
    expect(props.fetchSegments.callCount).to.equal(1);
    const div = processSegmentsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('failed to load: unreachable')).to.be.true;
  });

  it('renders on success', () => {
    const props = {
      fetchSegments: sinon.spy(),
      agent: '',
      process: '',
      segments: { status: statusTypes.LOADED, details: ['foo', 'bar'] }
    };
    const processSegmentsPage = renderComponent(props);
    expect(props.fetchSegments.callCount).to.equal(1);
    const div = processSegmentsPage.find('div');
    expect(div).to.have.lengthOf(3);
    expect(div.contains('foo')).to.be.true;
    expect(div.contains('bar')).to.be.true;
  });
});
