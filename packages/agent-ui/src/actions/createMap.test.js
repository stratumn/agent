import * as StratumnAgentClient from 'stratumn-agent-client';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {
  createMap,
  openCreateMapDialog,
  closeCreateMapDialog
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

describe('createMap action', () => {
  let stratumnClientStub;
  let dispatchSpy;
  let getStateStub;

  beforeEach(() => {
    stratumnClientStub = sinon.stub(StratumnAgentClient, 'getAgent');
    dispatchSpy = sinon.spy();
    getStateStub = sinon.stub();
  });

  afterEach(() => {
    stratumnClientStub.restore();
  });

  it('closes dialog on success', () => {
    const createMapStub = sinon.stub().resolves({});
    stratumnClientStub.resolves({
      getProcess: () => ({
        createMap: createMapStub
      })
    });
    getStateStub.returns({
      agents: { a: { url: '' } },
      createMap: { agent: 'a', process: 'p' }
    });

    return createMap('a new map')(dispatchSpy, getStateStub).then(() => {
      expect(getStateStub.callCount).to.equal(1);

      expect(createMapStub.getCall(0).args[0]).to.equal('a new map');
      expect(createMapStub.callCount).to.equal(1);

      expect(dispatchSpy.callCount).to.equal(3);
      expect(dispatchSpy.getCall(0).args[0].type).to.equal(
        actionTypes.CREATE_MAP_REQUEST
      );
      expect(dispatchSpy.getCall(1).args[0].type).to.equal(
        actionTypes.CREATE_MAP_SUCCESS
      );
      expect(dispatchSpy.getCall(2).args[0].type).to.equal(
        actionTypes.CREATE_MAP_DIALOG_CLOSE
      );
    });
  });
});
