import { Server } from 'mock-socket';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import {
  openWebSocket,
  closeWebSocket,
  closeAllWebSockets
} from './webSocketHelpers';

chai.use(sinonChai);

// see https://github.com/thoov/mock-socket/issues/176
jest.useFakeTimers();

describe('webSocket actions', () => {
  let mockServer;
  let dispatchSpy;
  let closeSpy;

  const openTestWebSocket = (name, url, onClose = null) => {
    const ws = openWebSocket(name, url);
    if (onClose) ws.onclose = onClose;
    jest.runOnlyPendingTimers();
  };

  beforeEach(() => {
    mockServer = new Server('ws://foo/bar');
    dispatchSpy = sinon.spy();
    closeSpy = sinon.spy();
  });

  afterEach(() => {
    mockServer.stop();
    closeAllWebSockets();
  });

  describe('openWebSocket()', () => {
    it('opens a ws for valid url', () => {
      openWebSocket('myWS', 'http://foo/bar');
      expect(mockServer.clients()).to.have.lengthOf(1);
    });

    it('does not open a ws for invalid url', () => {
      openWebSocket('myWS', 'http://not/a/url');
      expect(mockServer.clients()).to.have.lengthOf(0);
    });

    it('closes previously opened ws', () => {
      openTestWebSocket('myWS', 'http://foo/bar', closeSpy);
      openTestWebSocket('myWS', 'http://foo/bar');

      expect(closeSpy.callCount).to.equal(1);
    });

    it('dispatches a notification action on didSave message', () => {
      openWebSocket('myWS', 'http://foo/bar', dispatchSpy);
      const msg = {
        type: 'didSave',
        data: {
          link: { meta: {} },
          meta: {}
        }
      };
      mockServer.send(JSON.stringify(msg));
      expect(dispatchSpy.callCount).to.equal(1);
    });

    it('doesnt dispatch an action on other messages', () => {
      openWebSocket('myWS', 'http://foo/bar', dispatchSpy);
      const msg = {
        type: 'foo/msg',
        data: {
          link: { meta: {} },
          meta: {}
        }
      };
      mockServer.send(JSON.stringify(msg));
      mockServer.send('this msg will be disregarded');
      expect(dispatchSpy.callCount).to.equal(0);
    });
  });

  describe('closeWebSocket()', () => {
    it('correctly closes a websocket', () => {
      openTestWebSocket('myWS', 'http://foo/bar', closeSpy);
      closeWebSocket('myWS');
      expect(closeSpy.callCount).to.equal(1);
    });

    it('does not fail to close unknown ws', () => {
      expect(() => closeWebSocket('myWS')).to.not.throw();
    });
  });

  describe('closeAllWebSockets', () => {
    it('closes all websockets', () => {
      openTestWebSocket('myWS1', 'http://foo/bar', closeSpy);
      openTestWebSocket('myWS2', 'http://foo/bar', closeSpy);

      expect(mockServer.clients()).to.have.lengthOf(2);
      closeAllWebSockets();
      expect(closeSpy.callCount).to.equal(2);
    });
  });
});
