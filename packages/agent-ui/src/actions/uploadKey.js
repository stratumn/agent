import { parseKey } from '@indigocore/client';
import * as actionTypes from '../constants/actionTypes';

const uploadKeySuccessEvent = (parsedKey, rawKey) => ({
  type: actionTypes.UPLOAD_KEY_SUCCESS,
  key: {
    ...parsedKey,
    pem: rawKey
  }
});

const uploadKeyFailureEvent = (key, error) => ({
  type: actionTypes.UPLOAD_KEY_FAILURE,
  key,
  error
});

export const deleteKey = () => dispatch => {
  dispatch({
    type: actionTypes.KEY_DELETE
  });
};

export const uploadKey = key => dispatch => {
  try {
    dispatch(uploadKeySuccessEvent(parseKey(key), key));
  } catch (err) {
    dispatch(uploadKeyFailureEvent(key, err));
  }
};
