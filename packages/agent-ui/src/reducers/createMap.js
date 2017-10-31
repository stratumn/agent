import { actionTypes } from '../actions';
import { statusTypes } from './';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.CREATE_MAP_DIALOG_OPEN:
      return {
        showDialog: true,
        agent: action.agent,
        process: action.process
      };
    case actionTypes.CREATE_MAP_DIALOG_CLOSE:
      return {
        showDialog: false
      };
    case actionTypes.CREATE_MAP_REQUEST:
      return {
        ...state,
        showDialog: true,
        status: statusTypes.LOADING
      };
    case actionTypes.CREATE_MAP_FAILURE:
      return {
        ...state,
        showDialog: true,
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.CREATE_MAP_SUCCESS:
      return {
        ...state,
        showDialog: false,
        status: statusTypes.LOADED
      };
    default:
      return state;
  }
}
