import React from 'react';

import { shallow } from 'enzyme';
import { expect } from 'chai';

import { statusTypes } from '../reducers';

import { SegmentPage, mapStateToProps } from './segmentPage';

describe('<SegmentPage />', () => {
  const segment = { meta: { data: 'this is so meta' } };

  it('correctly extracts segment from state', () => {
    const state = { segment: { status: statusTypes.LOADED, details: segment } };
    const props = mapStateToProps(state);
    expect(props).to.deep.equal({
      status: statusTypes.LOADED,
      segment: segment
    });
  });

  it('returns an error if no segment data in state', () => {
    const state = { segment: null };
    const props = mapStateToProps(state);
    expect(props.error).to.exist;
  });

  it('displays a loading screen', () => {
    const segmentPage = shallow(<SegmentPage status={statusTypes.LOADING} />);
    expect(segmentPage.find('div').contains('loading...')).to.equal(true);
  });

  it('displays an error message when segment is not found', () => {
    const segmentPage = shallow(<SegmentPage />);
    expect(segmentPage.find('.error')).to.have.length(1);
  });

  it('displays segment information', () => {
    const segmentPage = shallow(<SegmentPage segment={segment} />);
    expect(segmentPage.find('div').contains(JSON.stringify(segment))).to.be
      .true;
  });
});
