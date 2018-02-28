import { validateKey, parseKey } from '@indigoframework/client';
import * as actionTypes from '../constants/actionTypes';

const uploadKeySuccessEvent = key => ({
  type: actionTypes.UPLOAD_KEY_SUCCESS,
  key
});

const uploadKeyFailureEvent = (key, error) => ({
  type: actionTypes.UPLOAD_KEY_FAILURE,
  key,
  error
});

const deleteKeyEvent = () => ({
  type: actionTypes.KEY_DELETE
});

export const deleteKey = () => dispatch => {
  dispatch(deleteKeyEvent());
};

export const uploadKey = rawKey => dispatch => {
  try {
    const key = JSON.parse(rawKey);
    validateKey(key);
    dispatch(uploadKeySuccessEvent(parseKey(key)));
  } catch (err) {
    dispatch(uploadKeyFailureEvent(rawKey, err));
  }
};
