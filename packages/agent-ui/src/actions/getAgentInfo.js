import { getAgent } from 'stratumn-agent-client';
import { getAgentInfoSuccess } from './';

const url = 'http://localhost:3000/';

export default function getAgentInfo() {
  return function withDispatch(dispatch) {
    return getAgent(url)
      .then(res => dispatch(getAgentInfoSuccess(res)))
      .catch(error => {
        throw error;
      });
  };
}
