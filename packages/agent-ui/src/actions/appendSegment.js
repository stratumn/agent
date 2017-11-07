import { getAgent } from 'stratumn-agent-client';
import { actionTypes } from './';

const appendSegmentRequest = () => ({
  type: actionTypes.APPEND_SEGMENT_REQUEST
});

const appendSegmentFailure = error => ({
  type: actionTypes.APPEND_SEGMENT_FAILURE,
  error
});

const appendSegmentSuccess = () => ({
  type: actionTypes.APPEND_SEGMENT_SUCCESS
});

const appendSegmentClear = () => ({
  type: actionTypes.APPEND_SEGMENT_CLEAR
});

export const openDialog = (
  agentName,
  processName,
  processActions,
  parentLinkHash
) => ({
  type: actionTypes.APPEND_SEGMENT_DIALOG_OPEN,
  agent: agentName,
  process: processName,
  actions: processActions,
  parent: parentLinkHash
});

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

export const appendSegment = args => (dispatch, getState) => {
  dispatch(appendSegmentRequest());
  const {
    agents,
    appendSegment: { dialog: { agent, process, parent, selectedAction } }
  } = getState();
  if (agents[agent]) {
    const { url } = agents[agent];
    return getAgent(url)
      .then(a => {
        const proc = a.getProcess(process);
        return proc.createSegment(parent, selectedAction, ...args);
      })
      .then((/* segment */) => {
        dispatch(appendSegmentSuccess());
        dispatch(closeDialog());
      })
      .catch(err => {
        dispatch(appendSegmentFailure(err));
      });
  }
  return dispatch(appendSegmentFailure(`Can't find url for agent ${agent}`));
};
