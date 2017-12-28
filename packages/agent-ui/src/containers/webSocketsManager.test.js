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
  let closeStub;

  const requiredProps = {
    fetchAgent: () => {},
    agents: []
  };

  beforeEach(() => {
    closeStub = sinon.stub(webSocket, 'closeAllWebSockets');
  });

  afterEach(() => {
    closeStub.restore();
  });

  it('renders null', () => {
    const mgr = shallow(<WebSocketsManager {...requiredProps} />);
    expect(mgr.getElement()).to.be.null;
  });

  it('fetches stale agents on mount', () => {
    const fetchAgentSpy = sinon.spy();
    shallow(
      <WebSocketsManager
        fetchAgent={fetchAgentSpy}
        agents={[
          { name: 'foo', url: 'bar', status: statusTypes.STALE },
          { name: 'baz', url: 'baz', status: statusTypes.LOADED },
          { name: 'bar', url: 'foo', status: statusTypes.STALE }
        ]}
      />
    );

    expect(fetchAgentSpy.callCount).to.equal(2);
    expect(fetchAgentSpy.getCall(0).args[0]).to.equal('foo');
    expect(fetchAgentSpy.getCall(0).args[1]).to.equal('bar');
  });

  it('closes websockets on unmount', () => {
    const mgr = shallow(<WebSocketsManager {...requiredProps} />);
    mgr.unmount();
    expect(closeStub.callCount).to.equal(1);
  });

  it('returns empty agents list on empty state', () => {
    expect(mapStateToProps({})).to.deep.equal({ agents: [] });
  });

  it('extracts all agents regardless of status', () => {
    const state = {
      agents: {
        foo: { status: statusTypes.LOADED, name: 'foo', url: 'http://foo' },
        bar: { status: statusTypes.FAILED, name: 'bar', url: 'http://bar' },
        baz: { status: statusTypes.STALE, name: 'baz', url: 'http://baz' }
      }
    };

    const { agents } = mapStateToProps(state);
    expect(agents).to.have.lengthOf(3);
    expect(agents).to.deep.equal([
      { name: 'foo', url: 'http://foo', status: statusTypes.LOADED },
      { name: 'bar', url: 'http://bar', status: statusTypes.FAILED },
      { name: 'baz', url: 'http://baz', status: statusTypes.STALE }
    ]);
  });
});
