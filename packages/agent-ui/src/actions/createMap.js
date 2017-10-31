import { getAgent } from 'stratumn-agent-client';
import { actionTypes, getSegmentSuccess } from './';
import { history } from '../store';

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

const createMapClear = () => ({
  type: actionTypes.CREATE_MAP_CLEAR
});

export const openCreateMapDialog = (agentName, processName) => ({
  type: actionTypes.CREATE_MAP_DIALOG_OPEN,
  agent: agentName,
  process: processName
});

export const closeCreateMapDialog = () => ({
  type: actionTypes.CREATE_MAP_DIALOG_CLOSE
});

export const closeCreateMapDialogAndClear = () => dispatch => {
  dispatch(createMapClear());
  dispatch(closeCreateMapDialog());
};

export const createMap = title => (dispatch, getState) => {
  dispatch(createMapRequest());
  const { agents, createMap: { dialog: { agent, process } } } = getState();
  if (agents[agent]) {
    const { url } = agents[agent];
    return getAgent(url)
      .then(a => {
        const proc = a.getProcess(process);
        return proc.createMap(title);
      })
      .then(segment => {
        dispatch(createMapSuccess());
        dispatch(closeCreateMapDialog());
        dispatch(getSegmentSuccess(segment));
        history.push(`/${agent}/${process}/segment/${segment.meta.linkHash}`);
      })
      .catch(err => {
        dispatch(createMapFailure(err));
      });
  }
  return dispatch(createMapFailure(`Can't find url for agent ${agent}`));
};
