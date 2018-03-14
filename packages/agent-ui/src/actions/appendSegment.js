import { getAgent } from '@indigoframework/client';
import * as actionTypes from '../constants/actionTypes';
import { clearRefs, addNotifications, clearSignature } from './';
import { makeNewSegmentNotification } from '../utils/notificationHelpers';

const appendSegmentRequest = () => ({
  type: actionTypes.APPEND_SEGMENT_REQUEST
});

const appendSegmentFailure = error => ({
  type: actionTypes.APPEND_SEGMENT_FAILURE,
  error
});

const appendSegmentSuccess = segment => ({
  type: actionTypes.APPEND_SEGMENT_SUCCESS,
  segment
});

const appendSegmentClear = () => ({
  type: actionTypes.APPEND_SEGMENT_CLEAR
});

export const openDialog = (agentName, processName) => (dispatch, getState) => {
  const {
    agents,
    key,
    mapExplorer: { linkHash, processName: selectedSegmentProcess }
  } = getState();

  if (processName !== selectedSegmentProcess || !linkHash) {
    dispatch({
      type: actionTypes.APPEND_SEGMENT_DIALOG_MISSING_PREVIOUS
    });
  } else if (agents[agentName] && agents[agentName].processes[processName]) {
    const { init, ...segmentActions } = agents[agentName].processes[
      processName
    ].actions;

    dispatch({
      type: actionTypes.APPEND_SEGMENT_DIALOG_OPEN,
      agent: agentName,
      process: processName,
      actions: segmentActions,
      parent: linkHash,
      key: key
    });
  }
};

export const selectAction = actionName => ({
  type: actionTypes.APPEND_SEGMENT_DIALOG_SELECT_ACTION,
  action: actionName
});

export const closeDialog = () => ({
  type: actionTypes.APPEND_SEGMENT_DIALOG_CLOSE
});

export const closeDialogAndClear = () => dispatch => {
  dispatch(appendSegmentClear());
  dispatch(clearSignature());
  dispatch(closeDialog());
};

export const appendSegment = (...args) => (dispatch, getState) => {
  dispatch(appendSegmentRequest());
  const {
    agents,
    key,
    signedAttributes,
    appendSegment: { dialog: { agent, process, parent, selectedAction } },
    selectRefs: { refs }
  } = getState();
  if (agents[agent]) {
    const { url } = agents[agent];
    return getAgent(url)
      .then(a => a.getProcess(process).getSegment(parent))
      .then(s => {
        let parentSegment = s;
        if (key && Object.keys(signedAttributes).filter(Boolean).length > 0) {
          parentSegment = parentSegment.withKey(key).sign(signedAttributes);
        }
        return parentSegment.withRefs(refs)[selectedAction](...args);
      })
      .then(segment => {
        if (segment && segment.key) {
          delete segment.key;
        }
        dispatch(appendSegmentSuccess(segment));
        dispatch(closeDialog());
        dispatch(clearRefs());
        dispatch(clearSignature());
        dispatch(addNotifications([makeNewSegmentNotification(segment)]));
      })
      .catch(err => {
        dispatch(appendSegmentFailure(err));
      });
  }
  return dispatch(appendSegmentFailure(`Can't find url for agent ${agent}`));
};
