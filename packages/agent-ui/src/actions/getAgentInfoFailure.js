import { actionTypes } from './';

export default function(error) {
  console.log('getAgentInfoFailure', error);
  return { type: actionTypes.AGENT_INFO_FAILURE, error };
}
