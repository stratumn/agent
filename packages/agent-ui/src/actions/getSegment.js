import { getAgent } from 'stratumn-agent-client';
import * as statusTypes from '../constants/status';
import * as actionTypes from '../constants/actionTypes';

const getSegmentRequest = (agent, process, linkHash) => ({
  type: actionTypes.SEGMENT_REQUEST,
  agent,
  process,
  linkHash
});

const getSegmentFailure = error => ({
  type: actionTypes.SEGMENT_FAILURE,
  error
});

export const getSegmentSuccess = segment => ({
  type: actionTypes.SEGMENT_SUCCESS,
  segment
});

const shouldFetchSegment = (state, linkHash) => {
  const { segment: { status, linkHash: previousLinkHash, details } } = state;

  if (status === statusTypes.LOADING) {
    return false;
  }

  if (status === statusTypes.FAILED && previousLinkHash === linkHash) {
    return false;
  }

  // If we don't have any segment yet, fetch it
  if (!details) {
    return true;
  }

  // Otherwise fetch it if it's outdated
  return details.meta.linkHash !== linkHash;
};

export default function(agentName, processName, linkHash) {
  return (dispatch, getState) => {
    const state = getState();
    if (shouldFetchSegment(state, linkHash)) {
      dispatch(getSegmentRequest(agentName, processName, linkHash));
      const { agents } = state;
      if (agents[agentName]) {
        const { url } = agents[agentName];
        return getAgent(url)
          .then(a => {
            const proc = a.getProcess(processName);
            return proc.getSegment(linkHash);
          })
          .then(segment => dispatch(getSegmentSuccess(segment)))
          .catch(err => dispatch(getSegmentFailure(err)));
      }
      return dispatch(
        getSegmentFailure(`Can't find url for agent ${agentName}`)
      );
    }

    return Promise.resolve({});
  };
}
