import { getAgent } from 'stratumn-agent-client';
import { actionTypes } from './';

export const openCreateMapDialog = (agentName, processName) => ({
  type: actionTypes.CREATE_MAP_DIALOG_OPEN,
  agent: agentName,
  process: processName
});

export const closeCreateMapDialog = () => ({
  type: actionTypes.CREATE_MAP_DIALOG_CLOSE
});

const createMapRequest = () => ({
  type: actionTypes.CREATE_MAP_REQUEST
});

const createMapFailure = error => ({
  type: actionTypes.CREATE_MAP_FAILURE,
  error
});

const createMapSuccess = () => ({
  type: actionTypes.CREATE_MAP_SUCCESS
});

export const createMap = title => (dispatch, getState) => {
  dispatch(createMapRequest());
  const { agents, createMap: { agent, process } } = getState();
  if (agents[agent]) {
    const { url } = agents[agent];
    return getAgent(url)
      .then(a => {
        const proc = a.getProcess(process);
        return proc.createMap(title);
      })
      .then(segment => {
        console.log(segment);
        dispatch(createMapSuccess());
        dispatch(closeCreateMapDialog());
      })
      .catch(err => {
        dispatch(createMapFailure(err));
      });
  }
  return dispatch(createMapFailure(`Can't find url for agent ${agent}`));
};
