import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as actionTypes from '../constants/actionTypes';
import { updateSignedAttributes, clearSignature } from './signedAttributes';

chai.use(sinonChai);

describe('updateSignedAttributes action', () => {
  let getStateStub;
  let attr;
  let dispatchSpy;

  beforeEach(() => {
    dispatchSpy = sinon.spy();
    getStateStub = sinon.stub();
    getStateStub.returns({
      key: {
        public: 'public',
        type: 'type',
        secret: 'secret'
      }
    });

    attr = {
      inputs: true,
      action: true
    };
  });

  const verifyDispatchedActions = expectedActionTypes => {
    expect(dispatchSpy.callCount).to.equal(expectedActionTypes.length);
    for (let i = 0; i < expectedActionTypes.length; i += 1) {
      expect(dispatchSpy.getCall(i).args[0].type).to.equal(
        expectedActionTypes[i]
      );
    }
  };
  it('dispatch missing key event if not provided', () => {
    getStateStub.returns({});
    updateSignedAttributes(attr)(dispatchSpy, getStateStub);
    verifyDispatchedActions([actionTypes.MISSING_KEY]);
  });

  it('dispatch event correctly on success', () => {
    updateSignedAttributes(attr)(dispatchSpy, getStateStub);
    verifyDispatchedActions([actionTypes.UPDATE_SIGNED_ATTRIBUTES]);
  });
});

describe('clearSignatures action', () => {
  const action = clearSignature();
  expect(action).to.deep.equal({
    type: actionTypes.CLEAR_SIGNED_ATTRIBUTES
  });
});
