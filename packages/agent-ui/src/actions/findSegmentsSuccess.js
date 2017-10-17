import { actionTypes } from './';

export default function(segments) {
  return { type: actionTypes.FIND_SEGMENTS_SUCCESS, segments };
}
