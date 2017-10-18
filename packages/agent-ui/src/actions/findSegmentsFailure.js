import { actionTypes } from './';

export default function(error) {
  return { type: actionTypes.FIND_SEGMENTS_FAILURE, error };
}
