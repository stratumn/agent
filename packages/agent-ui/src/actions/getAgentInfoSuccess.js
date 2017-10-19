import { actionTypes } from './';

export default function(name, url, info) {
  return { type: actionTypes.AGENT_INFO_SUCCESS, name, url, info };
}
