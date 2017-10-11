import { actionTypes } from './';

export default function getAgentInfoSuccess(info) {
  console.log('getAgentInfoSuccess', info);
  return { type: actionTypes.AGENT_INFO_SUCCESS, info };
}
