import { actionTypes } from '../actions';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.SEGMENTS_REQUEST:
    case actionTypes.SEGMENTS_ERROR:
    case actionTypes.SEGMENTS_SUCCESS:
    default:
      return state;
  }
}
