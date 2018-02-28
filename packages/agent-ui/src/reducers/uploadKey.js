import { REHYDRATE } from 'redux-persist';
import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

export default function(state = {}, action) {
  const { key } = action;
  switch (action.type) {
    case actionTypes.UPLOAD_KEY_FAILURE:
      return {
        status: statusTypes.FAILED,
        error: action.error
      };
    case actionTypes.UPLOAD_KEY_SUCCESS:
      return {
        ...key,
        status: statusTypes.LOADED
      };
    case actionTypes.KEY_DELETE: {
      return null;
    }
    case REHYDRATE: {
      if (!action.payload || !action.payload.key || !action.payload.key.secret)
        return state;
      return {
        ...action.payload.key,
        secret: Buffer.from(action.payload.key.secret.data || []),
        status: statusTypes.LOADED
      };
    }
    default:
      return state && Object.keys(state).length > 0 ? state : null;
  }
}
