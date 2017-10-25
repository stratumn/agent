import { actionTypes } from '../actions';
import { statusTypes } from './';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.SEGMENTS_REQUEST:
      return {
        ...state,
        status: statusTypes.LOADING,
        segments: []
      };
    case actionTypes.SEGMENTS_FAILURE:
      return {
        ...state,
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.SEGMENTS_SUCCESS:
      return {
        ...state,
        status: statusTypes.LOADED,
        segments: action.segments.map(({ meta: { linkHash } }) => linkHash)
      };
    default:
      return state;
  }
}
