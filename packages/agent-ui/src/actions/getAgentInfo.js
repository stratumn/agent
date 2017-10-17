import { getAgent } from 'stratumn-agent-client';
import { getAgentInfoSuccess, getAgentInfoFailure } from './';

export default function(url) {
  return dispatch =>
    getAgent(url)
      .then(agent => dispatch(getAgentInfoSuccess(agent)))
      .catch(err => dispatch(getAgentInfoFailure(err)));
}
