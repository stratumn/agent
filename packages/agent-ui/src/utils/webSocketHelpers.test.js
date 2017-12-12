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

describe('webSocket actions', () => {
  let mockServer;
  let dispatchSpy;
  let closeSpy;

  // delay the websocket response when the connection is open
  // due to timeout hack in mock library:
  // https://github.com/thoov/mock-socket/blob/9fc37773a7b95f944aaffc5aac449b57dc4f037b/src/helpers/delay.js#L1
  const openWebSocketPromise = (name, url, onClose = null) =>
    new Promise(resolve => {
      openWebSocket(name, url);
      mockServer.clients().forEach(ws => {
        if (onClose) ws.onclose = onClose;
        ws.onopen = resolve;
      });
    });

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

    it('closes previously opened ws', () =>
      openWebSocketPromise('myWS', 'http://foo/bar', closeSpy)
        .then(() => openWebSocket('myWS', 'http://foo/bar'))
        .then(() => {
          expect(closeSpy.callCount).to.equal(1);
        }));

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
    it('correctly closes a websocket', () =>
      openWebSocketPromise('myWS', 'http://foo/bar', closeSpy)
        .then(() => closeWebSocket('myWS'))
        .then(() => {
          expect(closeSpy.callCount).to.equal(1);
        }));

    it('does not fail to close unknown ws', () => {
      expect(() => closeWebSocket('myWS')).to.not.throw();
    });
  });

  describe('closeAllWebSockets', () => {
    it('closes all websockets', () =>
      Promise.all([
        openWebSocketPromise('myWS1', 'http://foo/bar', closeSpy),
        openWebSocketPromise('myWS2', 'http://foo/bar', closeSpy)
      ]).then(() => {
        const clients = mockServer.clients();
        expect(clients).to.have.lengthOf(2);
        closeAllWebSockets();
        expect(closeSpy.callCount).to.equal(2);
      }));
  });
});
