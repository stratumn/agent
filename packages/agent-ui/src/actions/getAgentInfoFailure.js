import { actionTypes } from './';

export default function(error) {
  return { type: actionTypes.AGENT_INFO_FAILURE, error };
}
