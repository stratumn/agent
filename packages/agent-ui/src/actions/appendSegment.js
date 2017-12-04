import { getAgent } from 'stratumn-agent-client';
import * as actionTypes from '../constants/actionTypes';
import { clearRefs, addNotifications, makeNewSegmentNotification } from './';

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

export const openDialog = agentName => (dispatch, getState) => {
  const { agents, mapExplorer: { linkHash, processName } } = getState();
  if (agents[agentName] && agents[agentName].processes[processName]) {
    const { init, ...segmentActions } = agents[agentName].processes[
      processName
    ].actions;

    dispatch({
      type: actionTypes.APPEND_SEGMENT_DIALOG_OPEN,
      agent: agentName,
      process: processName,
      actions: segmentActions,
      parent: linkHash
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
  dispatch(closeDialog());
};

export const appendSegment = (...args) => (dispatch, getState) => {
  dispatch(appendSegmentRequest());
  const {
    agents,
    appendSegment: { dialog: { agent, process, parent, selectedAction } },
    selectRefs: { refs }
  } = getState();
  if (agents[agent]) {
    const { url } = agents[agent];
    return getAgent(url)
      .then(a => {
        const proc = a.getProcess(process);
        return proc.getSegment(parent);
      })
      .then(parentSegment =>
        parentSegment.withRefs(refs)[selectedAction](...args)
      )
      .then(segment => {
        dispatch(appendSegmentSuccess(segment));
        dispatch(closeDialog());
        dispatch(clearRefs());
        dispatch(
          addNotifications([
            makeNewSegmentNotification(agent, process, segment)
          ])
        );
      })
      .catch(err => {
        dispatch(appendSegmentFailure(err));
      });
  }
  return dispatch(appendSegmentFailure(`Can't find url for agent ${agent}`));
};
