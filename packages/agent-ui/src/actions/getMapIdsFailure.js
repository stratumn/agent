import { actionTypes } from './';

export default function(error) {
  return { type: actionTypes.MAP_IDS_FAILURE, error };
}
