import { actionTypes } from './';

export default function(mapIds) {
  return { type: actionTypes.MAP_IDS_SUCCESS, mapIds };
}
