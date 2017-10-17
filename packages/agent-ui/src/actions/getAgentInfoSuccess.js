import { actionTypes } from './';

export default function(info) {
  return { type: actionTypes.AGENT_INFO_SUCCESS, info };
}
