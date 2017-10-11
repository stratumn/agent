import { actionTypes } from '../actions';
import initialState from './initialState';

export default function(state = initialState, action) {
  console.log('getAgentInfoReducer');
  switch (action.type) {
    case actionTypes.AGENT_INFO_SUCCESS:
      return action.info;
    case actionTypes.AGENT_INFO_FAILURE:
      return action.error;
    default:
      return state;
  }
}
