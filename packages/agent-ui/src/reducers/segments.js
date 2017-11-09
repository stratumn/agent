import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.SEGMENTS_REQUEST:
      return {
        status: statusTypes.LOADING,
        details: []
      };
    case actionTypes.SEGMENTS_FAILURE:
      return {
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.SEGMENTS_SUCCESS:
      return {
        status: statusTypes.LOADED,
        details: action.segments.map(({ meta: { linkHash } }) => linkHash)
      };
    default:
      return state;
  }
}
