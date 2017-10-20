import { actionTypes } from '../actions';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.MAP_IDS_REQUEST:
    case actionTypes.MAP_IDS_ERROR:
    case actionTypes.MAP_IDS_SUCCESS:
    default:
      return state;
  }
}
