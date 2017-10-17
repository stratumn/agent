import { actionTypes } from './';

export default function(segments) {
  console.log('findSegmentsSuccess', segments);
  return { type: actionTypes.FIND_SEGMENTS_SUCCESS, segments };
}
