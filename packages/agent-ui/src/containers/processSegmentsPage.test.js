import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { ProcessSegmentsPage } from './processSegmentsPage';
import * as statusTypes from '../constants/status';
import history from '../store/history';

chai.use(sinonChai);

describe('<ProcessSegmentsPage />', () => {
  const requiredProps = {
    agent: '',
    process: '',
    segments: {},
    pathname: '',
    filters: {},
    search: '',
    fetchSegments: () => {}
  };

  const renderComponent = props =>
    mount(
      <MemoryRouter>
        <ProcessSegmentsPage {...requiredProps} {...props} />
      </MemoryRouter>
    );

  let historyStub;

  beforeEach(() => {
    historyStub = sinon.stub(history, 'push');
  });

  afterEach(() => {
    historyStub.restore();
  });

  it('calls fetch on mount', () => {
    const props = {
      fetchSegments: sinon.spy()
    };
    const processSegmentsPage = renderComponent(props);
    expect(props.fetchSegments.callCount).to.equal(1);
    const div = processSegmentsPage.find('div');
    expect(div).to.have.lengthOf(2);
    expect(div.contains('process segments')).to.be.true;
  });

  it('renders on loading', () => {
    const props = {
      fetchSegments: sinon.spy(),
      segments: { status: statusTypes.LOADING }
    };
    const processSegmentsPage = renderComponent(props);
    expect(props.fetchSegments.callCount).to.equal(1);
    const div = processSegmentsPage.find('div');
    expect(div).to.have.lengthOf(2);
    expect(div.contains('loading...')).to.be.true;
  });

  it('renders on failed', () => {
    const props = {
      fetchSegments: sinon.spy(),
      segments: { status: statusTypes.FAILED, error: 'unreachable' }
    };
    const processSegmentsPage = renderComponent(props);
    expect(props.fetchSegments.callCount).to.equal(1);
    const div = processSegmentsPage.find('div');
    expect(div).to.have.lengthOf(2);
    expect(div.contains('failed to load: unreachable')).to.be.true;
  });

  it('renders on success', () => {
    const props = {
      fetchSegments: sinon.spy(),
      segments: { status: statusTypes.LOADED, details: ['foo', 'bar'] }
    };
    const processSegmentsPage = renderComponent(props);
    expect(props.fetchSegments.callCount).to.equal(1);
    const div = processSegmentsPage.find('div');
    expect(div).to.have.lengthOf(4);
    expect(div.contains('foo')).to.be.true;
    expect(div.contains('bar')).to.be.true;
  });

  it('re renders when agent or process props changes', () => {
    const props = {
      fetchSegments: sinon.spy(),
      agent: 'foo',
      process: 'bar',
      segments: { status: statusTypes.LOADED, details: [] }
    };
    const processSegmentsPage = mount(
      <ProcessSegmentsPage {...requiredProps} {...props} />
    );
    processSegmentsPage.setProps({ ...props, agent: 'crazy' });
    expect(props.fetchSegments.callCount).to.equal(2);
    expect(props.fetchSegments.getCall(1).args[0]).to.equal('crazy');
    expect(props.fetchSegments.getCall(1).args[1]).to.equal('bar');
    processSegmentsPage.setProps({ ...props, process: 'crazy' });
    expect(props.fetchSegments.callCount).to.equal(3);
    expect(props.fetchSegments.getCall(2).args[0]).to.equal('foo');
    expect(props.fetchSegments.getCall(2).args[1]).to.equal('crazy');
  });

  it('does not re renders when other props changes', () => {
    const props = {
      fetchSegments: sinon.spy(),
      agent: 'foo',
      process: 'bar',
      segments: { status: statusTypes.LOADED, details: [] }
    };
    const processSegmentsPage = mount(
      <ProcessSegmentsPage {...requiredProps} {...props} />
    );
    processSegmentsPage.setProps({ ...props, something: 'else' });
    expect(props.fetchSegments.callCount).to.equal(1);
  });

  it('pushes to history on segment filters', () => {
    const props = {
      pathname: 'foo/bar',
      filters: {
        mapIds: ['aaa', 'bbb'],
        prevLinkHash: 'xyz',
        tags: ['foo', 'bar']
      }
    };
    const processSegmentsPage = renderComponent(props);
    const segmentsFilter = processSegmentsPage.find('SegmentsFilter');
    expect(segmentsFilter).to.have.lengthOf(1);
    const submitButton = segmentsFilter.find('[type="submit"]');
    expect(submitButton).to.have.lengthOf(1);
    submitButton.simulate('submit');
    expect(historyStub.callCount).to.equal(1);
    expect(historyStub.getCall(0).args[0]).to.equal(
      'foo/bar?mapIds%5B%5D=aaa&mapIds%5B%5D=bbb&tags%5B%5D=foo&tags%5B%5D=bar&prevLinkHash=xyz'
    );
  });

  it('pushes to history on segment filters clear', () => {
    const props = {
      pathname: 'foo/bar',
      filters: {
        mapIds: ['aaa', 'bbb'],
        prevLinkHash: 'xyz',
        tags: ['foo', 'bar']
      }
    };
    const processSegmentsPage = renderComponent(props);
    const segmentsFilter = processSegmentsPage.find('SegmentsFilter');
    expect(segmentsFilter).to.have.lengthOf(1);
    const clearButton = segmentsFilter.find('[type="clear"]');
    expect(clearButton).to.have.lengthOf(1);
    clearButton.simulate('click');
    expect(historyStub.callCount).to.equal(1);
    expect(historyStub.getCall(0).args[0]).to.equal('foo/bar?');
  });
});
