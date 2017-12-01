import { getAgent } from 'stratumn-agent-client';
import * as actionTypes from '../constants/actionTypes';

const getSegmentsRequest = (agent, process, options) => ({
  type: actionTypes.SEGMENTS_REQUEST,
  agent,
  process,
  options
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
    dispatch(getSegmentsRequest(agentName, processName, options));
    const { agents } = getState();
    if (agents[agentName]) {
      const { url } = agents[agentName];
      let promise = getAgent(url);

      if (processName !== null) {
        // Get the segments specific to this process
        promise = promise
          .then(a => {
            const proc = a.getProcess(processName);
            return proc.findSegments(options);
          })
          .then(segments => dispatch(getSegmentsSuccess(segments)));
      } else {
        // Get segments from all processes
        promise = promise
          .then(a => a.getProcesses())
          .then(processes =>
            Promise.all(processes.map(p => p.findSegments(options)))
          )
          .then(segments =>
            dispatch(getSegmentsSuccess(segments.reduce((a, b) => a.concat(b))))
          );
      }

      return promise.catch(err => dispatch(getSegmentsFailure(err)));
    }
    return dispatch(
      getSegmentsFailure(`Can't find url for agent ${agentName}`)
    );
  };
}
