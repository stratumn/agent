import * as actionTypes from '../constants/actionTypes';

export default function(state = {}, action) {
  const { signedAttributes } = action;

  switch (action.type) {
    case actionTypes.UPDATE_SIGNED_ATTRIBUTES:
      return {
        ...signedAttributes
      };
    case actionTypes.CLEAR_SIGNED_ATTRIBUTES:
      return {};
    default:
      return state;
  }
}
