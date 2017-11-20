import React from 'react';

import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as statusTypes from '../constants/status';

import { SegmentPage, mapStateToProps } from './segmentPage';

chai.use(sinonChai);

describe('<SegmentPage />', () => {
  const segment = { link: { meta: {} }, meta: { linkHash: 'this is so meta' } };
  const routeWithLinkHash = { match: { params: { id: 'l' } } };

  it('extracts segment loading status', () => {
    const state = { segment: { status: statusTypes.LOADING } };
    const props = mapStateToProps(state, routeWithLinkHash);
    expect(props.status).to.equal(statusTypes.LOADING);
  });

  it('extracts segment error if fetch failed', () => {
    const state = { segment: { status: statusTypes.FAILED, error: 'err!!!' } };
    const props = mapStateToProps(state, routeWithLinkHash);
    expect(props.status).to.equal(statusTypes.FAILED);
    expect(props.error).to.equal('err!!!');
  });

  const requiredProps = {
    getSegmentIfNeeded: () => {},
    agent: 'a',
    process: 'p',
    linkHash: 'l',
    refresh: false,
    classes: { circular: '' }
  };

  it('displays a loading screen', () => {
    const segmentPage = mount(
      <SegmentPage {...requiredProps} status={statusTypes.LOADING} />
    );
    expect(segmentPage.find('CircularProgress')).to.have.length(1);
  });

  it('displays an error message when segment is not found', () => {
    const segmentPage = shallow(<SegmentPage {...requiredProps} />);
    expect(segmentPage.find('.error')).to.have.length(1);
  });

  it('displays segment information', () => {
    const segmentPage = mount(
      <SegmentPage {...requiredProps} segment={segment} />
    );

    expect(segmentPage.find('pre').contains(JSON.stringify(segment, null, 2)))
      .to.be.true;
  });

  it('refreshes the segment when receiving props', () => {
    const segmentSpy = sinon.spy();
    const props = {
      ...requiredProps,
      getSegmentIfNeeded: segmentSpy,
      agent: 'a',
      process: 'p',
      linkHash: 'l'
    };

    const segmentPage = mount(<SegmentPage {...props} />);
    expect(segmentSpy.callCount).to.equal(1); // initial fetch

    segmentPage.setProps({ ...props, linkHash: 'll' });
    expect(segmentSpy.callCount).to.equal(2);
    expect(segmentSpy.getCall(1).args).to.deep.equal(['a', 'p', 'll']);
  });
});
