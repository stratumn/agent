import { getAgent } from 'stratumn-agent-client';
import * as actionTypes from '../constants/actionTypes';

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

export default function(agentName, processName) {
  return (dispatch, getState) => {
    dispatch(getMapIdsRequest(agentName, processName));
    const { agents } = getState();
    if (agents[agentName]) {
      const { url } = agents[agentName];
      return getAgent(url)
        .then(a => {
          const proc = a.getProcess(processName);
          return proc.getMapIds();
        })
        .then(mapIds => dispatch(getMapIdsSuccess(mapIds)))
        .catch(err => dispatch(getMapIdsFailure(err)));
    }
    return dispatch(getMapIdsFailure(`Can't find url for agent ${agentName}`));
  };
}
