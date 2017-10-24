import { getAgent } from 'stratumn-agent-client';
import { actionTypes } from './';

const getMapIdsRequest = (agent, process) => ({
  type: actionTypes.MAP_IDS_REQUEST,
  agent,
  process
});

const getMapIdsFailure = error => ({
  type: actionTypes.MAP_IDS_FAILURE,
  error
});

const getMapIdsSuccess = mapIds => ({
  type: actionTypes.MAP_IDS_SUCCESS,
  mapIds
});

export default function(agent, process) {
  return dispatch => {
    dispatch(getMapIdsRequest(agent, process));
    // TODO: get agent url
    const url = '';
    return getAgent(url)
      .then(a => {
        const proc = a.getProcess(process);
        return proc.getMapIds();
      })
      .then(mapIds => dispatch(getMapIdsSuccess(mapIds)))
      .catch(err => dispatch(getMapIdsFailure(err)));
  };
}
