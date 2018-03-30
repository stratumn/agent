import { getAgent as getAgentClient } from '@indigocore/client';
import * as actionTypes from '../constants/actionTypes';
import { openWebSocket, closeWebSocket } from '../utils/webSocketHelpers';

const getAgentRequest = (name, url) => ({
  type: actionTypes.AGENT_INFO_REQUEST,
  name,
  url
});

const getAgentFailure = (name, error) => ({
  type: actionTypes.AGENT_INFO_FAILURE,
  name,
  error
});

const getAgentSuccess = (name, agent) => ({
  type: actionTypes.AGENT_INFO_SUCCESS,
  name,
  agent
});

export const removeAgent = name => {
  closeWebSocket(name);
  return {
    type: actionTypes.AGENT_INFO_DELETE,
    name
  };
};

export const getAgent = (name, url) => dispatch => {
  dispatch(getAgentRequest(name, url));
  return getAgentClient(url)
    .then(agent => dispatch(getAgentSuccess(name, agent)))
    .then(() => openWebSocket(name, url, dispatch))
    .catch(err => dispatch(getAgentFailure(name, err)));
};
