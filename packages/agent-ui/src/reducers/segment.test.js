import { expect } from 'chai';

import segment from './segment';

import * as actionTypes from '../actions/actionTypes';
import * as statusTypes from '../status';

describe('segment reducer', () => {
  const requestSegmentAction = {
    type: actionTypes.SEGMENT_REQUEST,
    agent: 'a',
    process: 'p',
    linkHash: 'linkHash'
  };

  it('sets agent and process names, segment linkHash on request', () => {
    const requestState = segment({}, requestSegmentAction);

    expect(requestState).to.deep.equal({
      status: statusTypes.LOADING,
      agent: 'a',
      process: 'p',
      linkHash: 'linkHash'
    });
  });

  it('adds error information on failure', () => {
    const failedState = segment(segment({}, requestSegmentAction), {
      type: actionTypes.SEGMENT_FAILURE,
      error: 'failed'
    });

    expect(failedState).to.deep.equal({
      status: statusTypes.FAILED,
      agent: 'a',
      process: 'p',
      linkHash: 'linkHash',
      error: 'failed'
    });
  });

  it('adds segment details on success', () => {
    const validSegment = { name: 'I am a valid segment' };
    const successState = segment(segment({}, requestSegmentAction), {
      type: actionTypes.SEGMENT_SUCCESS,
      segment: validSegment
    });

    expect(successState).to.deep.equal({
      status: statusTypes.LOADED,
      agent: 'a',
      process: 'p',
      linkHash: 'linkHash',
      details: validSegment
    });
  });
});
