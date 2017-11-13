import * as actionTypes from '../constants/actionTypes';

export default function(segment) {
  if (segment) {
    return {
      type: actionTypes.MAP_EXPLORER_SELECT_SEGMENT,
      linkHash: segment.meta.linkHash
    };
  }

  return {
    type: actionTypes.MAP_EXPLORER_CLEAR_SEGMENT
  };
}
