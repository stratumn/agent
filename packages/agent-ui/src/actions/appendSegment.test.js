import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as StratumnAgentClient from 'stratumn-agent-client';

import {
  appendSegment,
  closeDialog,
  closeDialogAndClear,
  openDialog,
  selectAction
} from './appendSegment';

import * as actionTypes from '../actions/actionTypes';

chai.use(sinonChai);

describe('open action', () => {
  it('contains agent and process names, parent linkHash and process actions', () => {
    const processAction = { a1: { args: ['title'] } };
    const action = openDialog('a', 'p', processAction, 'l');
    expect(action).to.deep.equal({
      type: actionTypes.APPEND_SEGMENT_DIALOG_OPEN,
      agent: 'a',
      parent: 'l',
      process: 'p',
      actions: processAction
    });
  });
});

describe('close action', () => {
  it('clears agent and process names, process actions', () => {
    const action = closeDialog();
    expect(action).to.deep.equal({
      type: actionTypes.APPEND_SEGMENT_DIALOG_CLOSE
    });
  });
});

describe('closeAndClear action', () => {
  it('dispatch clear and close actions', () => {
    const dispatchSpy = sinon.spy();
    closeDialogAndClear()(dispatchSpy);
    expect(dispatchSpy.callCount).to.deep.equal(2);
    expect(dispatchSpy.getCall(0).args[0].type).to.equal(
      actionTypes.APPEND_SEGMENT_CLEAR
    );
    expect(dispatchSpy.getCall(1).args[0].type).to.equal(
      actionTypes.APPEND_SEGMENT_DIALOG_CLOSE
    );
  });
});

describe('selectAction action', () => {
  it('contains action name', () => {
    const action = selectAction('message');
    expect(action).to.deep.equal({
      type: actionTypes.APPEND_SEGMENT_DIALOG_SELECT_ACTION,
      action: 'message'
    });
  });
});

describe('appendSegment action', () => {
  let stratumnClientStub;
  let createSegmentStub;
  let dispatchSpy;
  let getStateStub;

  beforeEach(() => {
    dispatchSpy = sinon.spy();

    createSegmentStub = sinon.stub();
    stratumnClientStub = sinon.stub(StratumnAgentClient, 'getAgent');
    stratumnClientStub.resolves({
      getProcess: () => ({
        createSegment: createSegmentStub
      })
    });

    getStateStub = sinon.stub();
    getStateStub.returns({
      agents: { a: { url: '' } },
      appendSegment: {
        dialog: {
          show: true,
          agent: 'a',
          process: 'p',
          parent: 'l',
          actions: {
            ack: { args: [] },
            send: { args: ['author', 'message'] }
          },
          selectedAction: 'send'
        }
      }
    });
  });

  afterEach(() => {
    stratumnClientStub.restore();
  });

  const verifyDispatchedActions = expectedActionTypes => {
    expect(dispatchSpy.callCount).to.equal(expectedActionTypes.length);
    for (let i = 0; i < expectedActionTypes.length; i += 1) {
      expect(dispatchSpy.getCall(i).args[0].type).to.equal(
        expectedActionTypes[i]
      );
    }
  };

  it('dispatches a failure action on failure', () => {
    createSegmentStub.rejects('Unreachable');

    return appendSegment(['bob', 'loves pancakes'])(
      dispatchSpy,
      getStateStub
    ).then(() => {
      verifyDispatchedActions([
        actionTypes.APPEND_SEGMENT_REQUEST,
        actionTypes.APPEND_SEGMENT_FAILURE
      ]);
    });
  });

  it('closes dialog on success', () => {
    createSegmentStub.resolves({ meta: { linkHash: 'wowSuchHash' } });

    return appendSegment(['jim', 'hates pancakes'])(
      dispatchSpy,
      getStateStub
    ).then(() => {
      expect(getStateStub.callCount).to.equal(1);

      expect(createSegmentStub.callCount).to.equal(1);
      expect(createSegmentStub.getCall(0).args).to.deep.equal([
        'l',
        'send',
        'jim',
        'hates pancakes'
      ]);

      verifyDispatchedActions([
        actionTypes.APPEND_SEGMENT_REQUEST,
        actionTypes.APPEND_SEGMENT_SUCCESS,
        actionTypes.APPEND_SEGMENT_DIALOG_CLOSE
      ]);
    });
  });
});
