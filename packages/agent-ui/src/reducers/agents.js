import { actionTypes } from '../actions';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.AGENT_INFO_REQUEST:
      return {
        ...state,
        [action.name]: {
          status: 'LOADING',
          url: action.url,
          processes: {}
        }
      };
    case actionTypes.AGENT_INFO_FAILURE:
    case actionTypes.AGENT_INFO_SUCCESS:
    default:
      return state;
  }
}
