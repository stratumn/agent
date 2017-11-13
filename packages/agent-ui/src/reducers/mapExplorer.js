import * as actionTypes from '../constants/actionTypes';

export default function(state = {}, action) {
  switch (action.type) {
    case actionTypes.MAP_EXPLORER_CLEAR_SEGMENT:
      return {};
    case actionTypes.MAP_EXPLORER_SELECT_SEGMENT:
      return {
        linkHash: action.linkHash
      };
    default:
      return state;
  }
}
