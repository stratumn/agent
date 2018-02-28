import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import KeyManager from './keyManager';

chai.use(sinonChai);

describe('<KeyManager />', () => {
  const addKeySpy = sinon.spy();
  const deleteKeySpy = sinon.spy();
  const requiredProps = {
    addKey: addKeySpy,
    deleteKey: deleteKeySpy
  };

  const mountKeyManager = props =>
    mount(<KeyManager {...requiredProps} {...props} />);

  it('contains a dropzone to upload files', () => {
    const keyManager = mountKeyManager();
    const dropzone = keyManager.find('input[type="file"]');
    expect(dropzone.length).to.equal(1);
  });

  it('calls addKey when uploading a json file', () => {
    const keyManager = mountKeyManager();

    const fileInput = keyManager.find('input[type="file"]');
    fileInput.simulate('change', {
      target: {
        files: [new File([], 'test.json', { type: 'application/json' })]
      }
    });
    setTimeout(() => expect(requiredProps.addKey.callCount).to.equal(1), 20);
  });

  it('displays an error message', () => {
    const keyManager = mountKeyManager({
      userKey: { status: 'FAILED', error: { message: 'Fail' } }
    });
    const error = keyManager.find('Typography').at(1);
    expect(error.text()).to.equal('Fail');
  });

  it('displays the key', () => {
    const keyManager = mountKeyManager({
      userKey: { public: 'public', type: 'type' }
    });
    const pubKey = keyManager.find('CardHeader Typography').at(0);
    expect(pubKey.text()).to.equal('public');
    const keyType = keyManager.find('CardHeader Typography').at(1);
    expect(keyType.text()).to.equal('type public key');
  });

  it('provides a button to remove the key', () => {
    const keyManager = mountKeyManager({
      userKey: { public: 'public', type: 'type' }
    });

    const removeButton = keyManager.find('Button');
    expect(removeButton).to.have.length(1);
    removeButton.simulate('click');
    expect(deleteKeySpy.callCount).to.equal(1);
  });
});
