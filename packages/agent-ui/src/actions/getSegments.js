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

export default function(agent, process, options) {
  return dispatch => {
    dispatch(getSegmentsRequest(agent, process));
    // TODO: get agent url
    const url = '';
    return getAgent(url)
      .then(a => {
        const proc = a.getProcess(process);
        return proc.findSegments(options);
      })
      .then(res => dispatch(getSegmentsSuccess(res)))
      .catch(err => dispatch(getSegmentsFailure(err)));
  };
}
