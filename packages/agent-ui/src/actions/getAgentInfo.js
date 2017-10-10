import { getAgent } from 'stratumn-agent-client';

const url = 'http://localhost:3000/';

export function getAgentInfoSuccess(info) {
  console.log('getAgentInfoSuccess', info);
  return { type: 'AGENT_INFO_SUCCESS', info };
}

export function getAgentInfo() {
  return function(dispatch) {
    return getAgent(url)
      .then(res => dispatch(getAgentInfoSuccess(res)))
      .catch(error => {
        throw(error);
      });
  };
}