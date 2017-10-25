import { actionTypes } from '../actions';
import { statusTypes } from './';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.MAP_IDS_REQUEST:
      return {
        ...state,
        status: statusTypes.LOADING,
        mapIds: []
      };
    case actionTypes.MAP_IDS_FAILURE:
      return {
        ...state,
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.MAP_IDS_SUCCESS:
      return {
        ...state,
        status: statusTypes.LOADED,
        mapIds: action.mapIds
      };
    default:
      return state;
  }
}
