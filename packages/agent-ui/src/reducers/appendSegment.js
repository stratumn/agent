import { combineReducers } from 'redux';

import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

const appendSegmentDialogReducer = (state = { show: false }, action) => {
  switch (action.type) {
    case actionTypes.APPEND_SEGMENT_DIALOG_MISSING_PREVIOUS:
      return {
        show: true,
        error: 'You need to select a segment to append to'
      };
    case actionTypes.APPEND_SEGMENT_DIALOG_OPEN:
      return {
        show: true,
        agent: action.agent,
        process: action.process,
        parent: action.parent,
        actions: action.actions,
        selectedAction: Object.keys(action.actions)[0]
      };
    case actionTypes.APPEND_SEGMENT_DIALOG_SELECT_ACTION:
      if (Object.keys(state.actions).includes(action.action)) {
        return {
          ...state,
          selectedAction: action.action
        };
      }
      return state;
    case actionTypes.APPEND_SEGMENT_DIALOG_CLOSE:
      return {
        show: false
      };
    default:
      return state;
  }
};

const appendSegmentRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.APPEND_SEGMENT_REQUEST:
      return {
        status: statusTypes.LOADING
      };
    case actionTypes.APPEND_SEGMENT_FAILURE:
      return {
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.APPEND_SEGMENT_SUCCESS:
      return {
        status: statusTypes.LOADED
      };
    case actionTypes.APPEND_SEGMENT_CLEAR:
      return {};
    default:
      return state;
  }
};

const appendSegmentReducer = combineReducers({
  dialog: appendSegmentDialogReducer,
  request: appendSegmentRequestReducer
});

export default appendSegmentReducer;
