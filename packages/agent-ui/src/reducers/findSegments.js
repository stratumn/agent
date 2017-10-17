import { actionTypes } from '../actions';

export default function(state = null, action) {
  console.log('findSegmentsReducer');
  switch (action.type) {
    case actionTypes.FIND_SEGMENTS_SUCCESS:
      return action.segments;
    case actionTypes.FIND_SEGMENTS_FAILURE:
      return action.error;
    default:
      return state;
  }
}
