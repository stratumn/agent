import { getAgent } from 'stratumn-agent-client';
import { actionTypes } from './';

const getSegmentsRequest = (agent, process) => ({
  type: actionTypes.SEGMENTS_REQUEST,
  agent,
  process
});

const getSegmentsFailure = error => ({
  type: actionTypes.SEGMENTS_FAILURE,
  error
});

const getSegmentsSuccess = segments => ({
  type: actionTypes.SEGMENTS_SUCCESS,
  segments
});

export default function(agentName, processName, options) {
  return (dispatch, getState) => {
    dispatch(getSegmentsRequest(agentName, processName));
    const { agents } = getState();
    if (agents[agentName]) {
      const { url } = agents[agentName];
      return getAgent(url)
        .then(a => {
          const proc = a.getProcess(processName);
          return proc.findSegments(options);
        })
        .then(segments => dispatch(getSegmentsSuccess(segments)))
        .catch(err => dispatch(getSegmentsFailure(err)));
    }
    return dispatch(
      getSegmentsFailure(`Can't find url for agent ${agentName}`)
    );
  };
}
