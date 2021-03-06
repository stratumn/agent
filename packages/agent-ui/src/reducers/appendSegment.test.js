import { expect } from 'chai';

import appendSegment from './appendSegment';

import * as actionTypes from '../constants/actionTypes';
import * as statusTypes from '../constants/status';

describe('appendSegment reducer', () => {
  const openedState = {
    dialog: {
      show: true,
      agent: 'a',
      process: 'p',
      parent: 'l',
      actions: {
        send: { args: ['title', 'message'] },
        receive: { args: [] },
        kill: { args: ['target'] }
      },
      selectedAction: 'send',
      key: {
        type: 'keytype',
        secret: 'secret',
        public: 'public'
      }
    },
    request: {}
  };

  const openDialogAction = {
    type: actionTypes.APPEND_SEGMENT_DIALOG_OPEN,
    agent: 'a',
    process: 'p',
    parent: 'l',
    actions: openedState.dialog.actions,
    key: openedState.dialog.key
  };

  it('sets agent, process, parent, key and actions when opening dialog', () => {
    const openState = appendSegment({}, openDialogAction);

    expect(openState).to.deep.equal({
      dialog: {
        show: true,
        agent: openDialogAction.agent,
        process: openDialogAction.process,
        parent: openDialogAction.parent,
        actions: openDialogAction.actions,
        key: openDialogAction.key,
        selectedAction: 'send'
      },
      request: {}
    });
  });

  it('handles process with no actions', () => {
    const openState = appendSegment({}, { ...openDialogAction, actions: {} });
    expect(openState).to.deep.equal({
      dialog: {
        show: true,
        agent: openDialogAction.agent,
        process: openDialogAction.process,
        parent: openDialogAction.parent,
        key: openDialogAction.key,
        actions: {},
        selectedAction: undefined
      },
      request: {}
    });
  });

  it('ignores invalid action selection', () => {
    const actionSelectedState = appendSegment(openedState, {
      type: actionTypes.APPEND_SEGMENT_DIALOG_SELECT_ACTION,
      action: 'destroyLifeOnEarth'
    });

    expect(actionSelectedState.dialog.selectedAction).to.equal('send');
  });

  it('provides action selection', () => {
    const actionSelectedState = appendSegment(openedState, {
      type: actionTypes.APPEND_SEGMENT_DIALOG_SELECT_ACTION,
      action: 'receive'
    });

    expect(actionSelectedState.dialog.selectedAction).to.equal('receive');
  });

  it('clears dialog details on close', () => {
    const closedState = appendSegment(openedState, {
      type: actionTypes.APPEND_SEGMENT_DIALOG_CLOSE
    });

    expect(closedState).to.deep.equal({
      dialog: {
        show: false
      },
      request: {}
    });
  });

  it('update status on request', () => {
    const { request } = appendSegment(
      {},
      { type: actionTypes.APPEND_SEGMENT_REQUEST }
    );
    expect(request).to.deep.equal({ status: statusTypes.LOADING });
  });

  it('update status on success', () => {
    const { request } = appendSegment(
      {},
      {
        type: actionTypes.APPEND_SEGMENT_SUCCESS
      }
    );
    expect(request).to.deep.equal({
      status: statusTypes.LOADED
    });
  });

  it('update status and error on fail', () => {
    const { request } = appendSegment(
      {},
      { type: actionTypes.APPEND_SEGMENT_FAILURE, error: 'unknown' }
    );
    expect(request).to.deep.equal({
      status: statusTypes.FAILED,
      error: 'unknown'
    });
  });

  it('clears status and error on clear', () => {
    const { request } = appendSegment(
      { request: { status: 'yo', error: 'unknown' } },
      { type: actionTypes.APPEND_SEGMENT_CLEAR }
    );
    expect(request).to.deep.equal({});
  });

  it('keeps dialog details during request processing', () => {
    const validateState = (state, expectedStatus) => {
      expect(state.dialog.agent).to.equal(openedState.dialog.agent);
      expect(state.dialog.process).to.equal(openedState.dialog.process);
      expect(state.dialog.parent).to.equal(openedState.dialog.parent);
      expect(state.dialog.selectedAction).to.equal('send');
      expect(state.dialog.actions).to.deep.equal(openedState.dialog.actions);
      expect(state.request.status).to.equal(expectedStatus);
    };

    const requestState = appendSegment(openedState, {
      type: actionTypes.APPEND_SEGMENT_REQUEST
    });
    validateState(requestState, statusTypes.LOADING);

    const failedState = appendSegment(requestState, {
      type: actionTypes.APPEND_SEGMENT_FAILURE
    });
    validateState(failedState, statusTypes.FAILED);

    const successState = appendSegment(requestState, {
      type: actionTypes.APPEND_SEGMENT_SUCCESS
    });
    validateState(successState, statusTypes.LOADED);
  });
});
