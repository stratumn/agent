import React from 'react';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { statusTypes } from '../reducers';

import { SegmentPage, mapStateToProps } from './segmentPage';

chai.use(sinonChai);

describe('<SegmentPage />', () => {
  const segment = { meta: { linkHash: 'this is so meta' } };
  const routeWithLinkHash = { match: { params: { id: 'l' } } };

  it('refreshes segment if not initialized', () => {
    const state = {};
    const props = mapStateToProps(state, routeWithLinkHash);
    expect(props.refresh).to.be.true;
  });

  it('refreshes segment if mismatch with url', () => {
    const state = { segment: { details: segment } };
    const props = mapStateToProps(state, routeWithLinkHash);
    expect(props.refresh).to.be.true;
  });

  it('does not refresh segment if already loading', () => {
    const state = { segment: { status: statusTypes.LOADING } };
    const props = mapStateToProps(state, routeWithLinkHash);
    expect(props.refresh).to.be.false;
    expect(props.status).to.equal(statusTypes.LOADING);
  });

  it('does not refresh segment if fetch failed', () => {
    const state = { segment: { status: statusTypes.FAILED, error: 'err!!!' } };
    const props = mapStateToProps(state, routeWithLinkHash);
    expect(props.refresh).to.be.false;
    expect(props.status).to.equal(statusTypes.FAILED);
    expect(props.error).to.equal('err!!!');
  });

  const requiredProps = {
    getSegmentAction: () => {},
    agent: 'a',
    process: 'p',
    linkHash: 'l',
    refresh: false
  };

  it('displays a loading screen', () => {
    const segmentPage = shallow(
      <SegmentPage {...requiredProps} status={statusTypes.LOADING} />
    );
    expect(segmentPage.find('div').contains('loading...')).to.equal(true);
  });

  it('displays an error message when segment is not found', () => {
    const segmentPage = shallow(<SegmentPage {...requiredProps} />);
    expect(segmentPage.find('.error')).to.have.length(1);
  });

  it('displays segment information', () => {
    const segmentPage = shallow(
      <SegmentPage {...requiredProps} segment={segment} />
    );
    expect(segmentPage.find('div').contains(JSON.stringify(segment))).to.be
      .true;
  });

  it('refreshes the segment when outdated', () => {
    const segmentSpy = sinon.spy();
    const props = {
      getSegmentAction: segmentSpy,
      agent: 'a',
      process: 'p',
      linkHash: 'l',
      refresh: true
    };

    const segmentPage = mount(<SegmentPage {...props} />);
    expect(segmentSpy.callCount).to.equal(1); // initial fetch

    segmentPage.setProps({ ...props, linkHash: 'll' });
    expect(segmentSpy.callCount).to.equal(2);
    expect(segmentSpy.getCall(1).args).to.deep.equal(['a', 'p', 'll']);
  });
});
