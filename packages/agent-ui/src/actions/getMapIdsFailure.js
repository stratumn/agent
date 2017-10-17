import { actionTypes } from './';

export default function(error) {
  console.log('getMapIdsFailure', error);
  return { type: actionTypes.MAP_IDS_FAILURE, error };
}
