import { actionTypes } from './';

export default function(mapIds) {
  console.log('getMapIdsSuccess', mapIds);
  return { type: actionTypes.MAP_IDS_SUCCESS, mapIds };
}
