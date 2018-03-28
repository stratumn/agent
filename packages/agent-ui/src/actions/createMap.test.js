import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as StratumnAgentClient from '@indigoframework/client';
import history from '../store/history';

import {
  createMap,
  openCreateMapDialog,
  closeCreateMapDialog,
  closeCreateMapDialogAndClear
} from './createMap';

import {
  TestStateBuilder,
  TestAgentBuilder,
  TestProcessBuilder
} from '../test/builders/state';

import * as actionTypes from '../constants/actionTypes';

chai.use(sinonChai);

describe('openCreateMapDialog action', () => {
  let dispatchSpy;
  let getStateStub;

  beforeEach(() => {
    dispatchSpy = sinon.spy();
    getStateStub = sinon.stub();
  });

  it('finds init arguments from agent and process names', () => {
    const state = new TestStateBuilder()
      .withAgent(
        'a',
        new TestAgentBuilder()
          .withProcess(
            new TestProcessBuilder('p')
              .withAction('message', ['title', 'author'])
              .withAction('init', ['title', 'version'])
              .build()
          )
          .build()
      )
      .withKey({ pem: 'testPEM' })
      .build();
    getStateStub.returns(state);

    openCreateMapDialog('a', 'p')(dispatchSpy, getStateStub);

    expect(getStateStub.callCount).to.equal(1);
    expect(dispatchSpy.callCount).to.equal(1);
    expect(dispatchSpy.getCall(0).args[0]).to.deep.equal({
      type: actionTypes.CREATE_MAP_DIALOG_OPEN,
      agent: 'a',
      process: 'p',
      args: ['title', 'version'],
      key: { pem: 'testPEM' }
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
    expect(dispatchSpy.callCount).to.deep.equal(4);
    expect(dispatchSpy.getCall(0).args[0].type).to.equal(
      actionTypes.CREATE_MAP_CLEAR
    );
    expect(dispatchSpy.getCall(1).args[0].type).to.equal(
      actionTypes.CREATE_MAP_DIALOG_CLOSE
    );
    expect(dispatchSpy.getCall(2).args[0].type).to.equal(
      actionTypes.SELECT_REFS_CLEAR
    );
    expect(dispatchSpy.getCall(3).args[0].type).to.equal(
      actionTypes.CLEAR_SIGNED_ATTRIBUTES
    );
  });
});

describe('createMap action', () => {
  let stratumnClientStub;
  let historyStub;
  let createMapStub;
  let dispatchSpy;
  let getStateStub;
  let withRefsStub;
  let withKeyStub;
  let signStub;
  let testRefs;
  let testKey;
  let signedAttributes;

  beforeEach(() => {
    dispatchSpy = sinon.spy();

    createMapStub = sinon.stub();
    withRefsStub = sinon
      .stub()
      .onCall(0)
      .returns({
        createMap: createMapStub
      });

    signStub = sinon
      .stub()
      .onCall(0)
      .returns({
        withRefs: withRefsStub
      });

    withKeyStub = sinon
      .stub()
      .onCall(0)
      .returns({
        sign: signStub
      });

    stratumnClientStub = sinon.stub(StratumnAgentClient, 'getAgent');
    stratumnClientStub.resolves({
      getProcess: () => ({
        withRefs: withRefsStub,
        withKey: withKeyStub
      })
    });

    historyStub = sinon.stub(history, 'push');

    testRefs = [
      { process: 'a', linkHash: 'b' },
      { process: 'c', linkHash: 'd' }
    ];

    testKey = {
      type: 'keytype',
      secret: 'secret',
      public: 'public',
      pem: 'testPEM'
    };

    signedAttributes = {
      inputs: true
    };

    getStateStub = sinon.stub();
    getStateStub.returns({
      agents: { a: { url: '' } },
      createMap: {
        dialog: {
          show: true,
          agent: 'a',
          process: 'p'
        }
      },
      key: testKey,
      signedAttributes,
      selectRefs: { refs: testRefs }
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
      expect(withRefsStub.callCount).to.equal(1);
      expect(withRefsStub.getCall(0).args[0]).to.deep.equal(testRefs);

      verifyDispatchedActions([
        actionTypes.CREATE_MAP_REQUEST,
        actionTypes.CREATE_MAP_FAILURE
      ]);
    });
  });

  it('closes dialog on success, dispatches segment success and navigates to segment page', () => {
    createMapStub.resolves({ meta: { linkHash: 'wowSuchHash' } });

    return createMap('a new map', 'that rocks')(
      dispatchSpy,
      getStateStub
    ).then(() => {
      expect(getStateStub.callCount).to.equal(1);

      expect(withRefsStub.callCount).to.equal(1);
      expect(withRefsStub.getCall(0).args[0]).to.deep.equal(testRefs);

      expect(withKeyStub.callCount).to.equal(1);
      expect(withKeyStub.getCall(0).args[0]).to.deep.equal(testKey.pem);

      expect(signStub.callCount).to.equal(1);
      expect(signStub.getCall(0).args[0]).to.deep.equal(signedAttributes);

      expect(createMapStub.getCall(0).args).to.deep.equal([
        'a new map',
        'that rocks'
      ]);
      expect(createMapStub.callCount).to.equal(1);

      verifyDispatchedActions([
        actionTypes.CREATE_MAP_REQUEST,
        actionTypes.CREATE_MAP_SUCCESS,
        actionTypes.SELECT_REFS_CLEAR,
        actionTypes.CLEAR_SIGNED_ATTRIBUTES,
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
