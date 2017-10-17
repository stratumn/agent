import { actionTypes } from './';

export default function(error) {
  console.log('findSegmentsFailure', error);
  return { type: actionTypes.FIND_SEGMENTS_FAILURE, error };
}
