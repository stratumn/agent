import * as actionTypes from '../constants/actionTypes';

export default function(state = [], action) {
  switch (action.type) {
    case actionTypes.ADD_NOTIFICATIONS:
      return [...state, ...action.data.filter(({ key }) => key)];
    case actionTypes.REMOVE_NOTIFICATIONS:
      return state.filter(({ key }) => action.keys.indexOf(key) < 0);
    default:
      return state;
  }
}
