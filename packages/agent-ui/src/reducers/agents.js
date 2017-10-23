import { actionTypes } from '../actions';

export default function(state = {}, action) {
  const agent = {};
  switch (action.type) {
    case actionTypes.AGENT_INFO_REQUEST:
      agent[action.name] = {
        status: 'LOADING',
        url: action.url,
        processes: {}
      };
      return Object.assign({}, state, agent);
    case actionTypes.AGENT_INFO_FAILURE:
    case actionTypes.AGENT_INFO_SUCCESS:
    default:
      return state;
  }
}
