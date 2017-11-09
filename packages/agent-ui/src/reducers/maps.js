import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.MAP_IDS_REQUEST:
      return {
        status: statusTypes.LOADING,
        mapIds: []
      };
    case actionTypes.MAP_IDS_FAILURE:
      return {
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.MAP_IDS_SUCCESS:
      return {
        status: statusTypes.LOADED,
        mapIds: action.mapIds
      };
    default:
      return state;
  }
}
