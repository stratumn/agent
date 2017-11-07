import { combineReducers } from 'redux';

import * as actionTypes from '../actions/actionTypes';
import * as statusTypes from './status';

const createMapDialogReducer = (state = { show: false }, action) => {
  switch (action.type) {
    case actionTypes.CREATE_MAP_DIALOG_OPEN:
      return {
        show: true,
        agent: action.agent,
        process: action.process
      };
    case actionTypes.CREATE_MAP_DIALOG_CLOSE:
      return {
        show: false
      };
    default:
      return state;
  }
};

const createMapRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CREATE_MAP_REQUEST:
      return {
        status: statusTypes.LOADING
      };
    case actionTypes.CREATE_MAP_FAILURE:
      return {
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.CREATE_MAP_SUCCESS:
      return {
        status: statusTypes.LOADED
      };
    case actionTypes.CREATE_MAP_CLEAR:
      return {};
    default:
      return state;
  }
};

const createMapReducer = combineReducers({
  dialog: createMapDialogReducer,
  request: createMapRequestReducer
});

export default createMapReducer;
