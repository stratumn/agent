import React from 'react';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as webSocket from '../utils/webSocketHelpers';
import { mapStateToProps, WebSocketsManager } from './webSocketsManager';
import * as statusTypes from '../constants/status';

chai.use(sinonChai);

describe('<WebSocketsManager />', () => {
  let openStub;
  let closeStub;

  const requiredProps = {
    dispatch: () => {},
    webSocketUrls: []
  };

  beforeEach(() => {
    openStub = sinon.stub(webSocket, 'openWebSocket');
    closeStub = sinon.stub(webSocket, 'closeAllWebSockets');
  });

  afterEach(() => {
    openStub.restore();
    closeStub.restore();
  });

  it('renders null', () => {
    const mgr = shallow(<WebSocketsManager {...requiredProps} />);
    expect(mgr.getElement()).to.be.null;
  });

  it('open websockets on mount', () => {
    shallow(
      <WebSocketsManager
        {...requiredProps}
        webSocketUrls={[
          { name: 'foo', url: 'bar' },
          { name: 'bar', url: 'foo' }
        ]}
      />
    );
    expect(openStub.callCount).to.equal(2);
    expect(openStub.getCall(0).args[0]).to.equal('foo');
    expect(openStub.getCall(0).args[1]).to.equal('bar');
  });

  it('closes websockets on unmount', () => {
    const mgr = shallow(<WebSocketsManager {...requiredProps} />);
    mgr.unmount();
    expect(closeStub.callCount).to.equal(1);
  });

  it('returns empty webSocketUrls on empty state', () => {
    expect(mapStateToProps({})).to.deep.equal({ webSocketUrls: [] });
  });

  it('extracts only loaded agents', () => {
    const state = {
      agents: {
        foo: { status: statusTypes.LOADED, name: 'foo', url: 'http://foo' },
        bar: { status: statusTypes.FAILED, name: 'bar', url: 'http://bar' }
      }
    };
    const { webSocketUrls } = mapStateToProps(state);
    expect(webSocketUrls).to.have.lengthOf(1);
    expect(webSocketUrls).to.deep.equal([{ name: 'foo', url: 'http://foo' }]);
  });
});
