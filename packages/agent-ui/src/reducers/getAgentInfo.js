import { actionTypes } from '../actions';

export default function(state = null, action) {
  console.log('getAgentInfoReducer');
  switch (action.type) {
    case actionTypes.AGENT_INFO_SUCCESS:
      return action.info;
    default:
      return state;
  }
}
