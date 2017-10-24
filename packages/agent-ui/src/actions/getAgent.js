import { getAgent } from 'stratumn-agent-client';
import { actionTypes } from './';

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

export default function(name, url) {
  return dispatch => {
    dispatch(getAgentRequest(name, url));
    return getAgent(url)
      .then(agent => dispatch(getAgentSuccess(name, agent)))
      .catch(err => dispatch(getAgentFailure(name, err)));
  };
}
