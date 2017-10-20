import { getAgent } from 'stratumn-agent-client';
import { actionTypes } from './';

const getAgentRequest = (name, url) => ({
  type: actionTypes.AGENT_INFO_REQUEST,
  name,
  url
});

const getAgentError = error => ({
  type: actionTypes.AGENT_INFO_ERROR,
  error
});

const getAgentSuccess = agent => ({
  type: actionTypes.AGENT_INFO_SUCCESS,
  agent
});

export default function(name, url) {
  return dispatch => {
    dispatch(getAgentRequest(name, url));
    return getAgent(url)
      .then(agent => dispatch(getAgentSuccess(agent)))
      .catch(err => dispatch(getAgentError(err)));
  };
}
