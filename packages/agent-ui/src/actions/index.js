export { getAgent, removeAgent } from './getAgent';
export { default as getMapIds } from './getMapIds';
export { default as getSegment, getSegmentSuccess } from './getSegment';
export { default as getSegments } from './getSegments';
export { default as selectMapSegment } from './selectSegment';

export {
  createMap,
  openCreateMapDialog,
  closeCreateMapDialog,
  closeCreateMapDialogAndClear
} from './createMap';

export {
  appendSegment,
  openDialog as openAppendSegmentDialog,
  closeDialog as closeAppendSegmentDialog,
  closeDialogAndClear as closeAppendSegmentDialogAndClear,
  selectAction as selectAppendSegmentAction
} from './appendSegment';
