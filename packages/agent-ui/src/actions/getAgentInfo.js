import { getAgent } from 'stratumn-agent-client';
import { getAgentInfoSuccess, getAgentInfoFailure } from './';

export default function(name) {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.agents[name]) {
      return dispatch(getAgentInfoFailure(`No agent named ${name}`));
    }
    const { url } = state.agents[name];
    return getAgent(url)
      .then(agent => dispatch(getAgentInfoSuccess(name, url, agent)))
      .catch(err => dispatch(getAgentInfoFailure(err)));
  };
}
