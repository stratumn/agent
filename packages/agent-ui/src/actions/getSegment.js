import { getAgent } from 'stratumn-agent-client';
import { actionTypes } from './';

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

export default function(agentName, processName, linkHash) {
  return (dispatch, getState) => {
    dispatch(getSegmentRequest(agentName, processName, linkHash));
    const { agents } = getState();
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
    return dispatch(getSegmentFailure(`Can't find url for agent ${agentName}`));
  };
}
