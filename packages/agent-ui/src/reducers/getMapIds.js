import { actionTypes } from '../actions';

export default function(state = null, action) {
  console.log('getMapIdsReducer');
  switch (action.type) {
    case actionTypes.MAP_IDS_SUCCESS:
      return action.mapIds;
    case actionTypes.MAP_IDS_FAILURE:
      return action.error;
    default:
      return state;
  }
}
