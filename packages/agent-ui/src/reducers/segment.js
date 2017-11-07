import * as actionTypes from '../actions/actionTypes';
import { statusTypes } from './';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.SEGMENT_REQUEST:
      return {
        status: statusTypes.LOADING,
        agent: action.agent,
        process: action.process,
        linkHash: action.linkHash
      };
    case actionTypes.SEGMENT_FAILURE:
      return {
        ...state,
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.SEGMENT_SUCCESS:
      return {
        ...state,
        status: statusTypes.LOADED,
        details: action.segment
      };
    default:
      return state;
  }
}
