import * as actionTypes from '../constants/actionTypes';

const updateAttributes = attr => ({
  type: actionTypes.UPDATE_SIGNED_ATTRIBUTES,
  signedAttributes: attr
});

const missingKey = () => ({
  type: actionTypes.MISSING_KEY
});

export const clearSignature = () => ({
  type: actionTypes.CLEAR_SIGNED_ATTRIBUTES
});

export const updateSignedAttributes = attributes => (dispatch, getState) => {
  const { key } = getState();
  if (key) {
    return dispatch(updateAttributes(attributes));
  }
  return dispatch(missingKey());
};
