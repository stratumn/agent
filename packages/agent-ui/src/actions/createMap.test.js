import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as StratumnAgentClient from 'stratumn-agent-client';
import history from '../store/history';

import {
  createMap,
  openCreateMapDialog,
  closeCreateMapDialog,
  closeCreateMapDialogAndClear
} from './createMap';
import { actionTypes } from '../actions';

chai.use(sinonChai);

describe('openCreateMapDialog action', () => {
  it('contains agent and process names', () => {
    const action = openCreateMapDialog('a', 'p');
    expect(action).to.deep.equal({
      type: actionTypes.CREATE_MAP_DIALOG_OPEN,
      agent: 'a',
      process: 'p'
    });
  });
});

describe('closeCreateMapDialog action', () => {
  it('clears agent and process names', () => {
    const action = closeCreateMapDialog();
    expect(action).to.deep.equal({
      type: actionTypes.CREATE_MAP_DIALOG_CLOSE
    });
  });
});

describe('closeCreateMapDialogAndClear action', () => {
  it('dispatch clear and close actions', () => {
    const dispatchSpy = sinon.spy();
    closeCreateMapDialogAndClear()(dispatchSpy);
    expect(dispatchSpy.callCount).to.deep.equal(2);
    expect(dispatchSpy.getCall(0).args[0].type).to.equal(
      actionTypes.CREATE_MAP_CLEAR
    );
    expect(dispatchSpy.getCall(1).args[0].type).to.equal(
      actionTypes.CREATE_MAP_DIALOG_CLOSE
    );
  });
});

describe('createMap action', () => {
  let stratumnClientStub;
  let historyStub;
  let createMapStub;
  let dispatchSpy;
  let getStateStub;

  beforeEach(() => {
    dispatchSpy = sinon.spy();

    createMapStub = sinon.stub();
    stratumnClientStub = sinon.stub(StratumnAgentClient, 'getAgent');
    stratumnClientStub.resolves({
      getProcess: () => ({
        createMap: createMapStub
      })
    });

    historyStub = sinon.stub(history, 'push');

    getStateStub = sinon.stub();
    getStateStub.returns({
      agents: { a: { url: '' } },
      createMap: {
        dialog: {
          show: true,
          agent: 'a',
          process: 'p'
        }
      }
    });
  });

  afterEach(() => {
    stratumnClientStub.restore();
    historyStub.restore();
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
    createMapStub.rejects('Unreachable');

    return createMap('i will fail')(dispatchSpy, getStateStub).then(() => {
      verifyDispatchedActions([
        actionTypes.CREATE_MAP_REQUEST,
        actionTypes.CREATE_MAP_FAILURE
      ]);
    });
  });

  it('closes dialog on success, dispatches segment success and navigates to segment page', () => {
    createMapStub.resolves({ meta: { linkHash: 'wowSuchHash' } });

    return createMap('a new map')(dispatchSpy, getStateStub).then(() => {
      expect(getStateStub.callCount).to.equal(1);

      expect(createMapStub.getCall(0).args[0]).to.equal('a new map');
      expect(createMapStub.callCount).to.equal(1);

      verifyDispatchedActions([
        actionTypes.CREATE_MAP_REQUEST,
        actionTypes.CREATE_MAP_SUCCESS,
        actionTypes.CREATE_MAP_DIALOG_CLOSE,
        actionTypes.SEGMENT_SUCCESS
      ]);

      expect(historyStub.callCount).to.equal(1);
      expect(historyStub.getCall(0).args[0]).to.equal(
        '/a/p/segments/wowSuchHash'
      );
    });
  });
});
