import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { ProcessMapsPage } from './processMapsPage';
import { statusTypes } from '../reducers';

chai.use(sinonChai);

describe('<ProcessMapsPage />', () => {
  it('calls fetch on mount', () => {
    const props = {
      fetchMapIds: sinon.spy(),
      agent: 'foo',
      process: 'bar',
      maps: {}
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);
    expect(props.fetchMapIds.callCount).to.equal(1);
    expect(props.fetchMapIds.getCall(0).args[0]).to.equal('foo');
    expect(props.fetchMapIds.getCall(0).args[1]).to.equal('bar');
    const div = processMapsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('process maps')).to.be.true;
  });

  it('renders on loading', () => {
    const props = {
      fetchMapIds: sinon.spy(),
      agent: 'foo',
      process: 'bar',
      maps: { status: statusTypes.LOADING }
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);
    expect(props.fetchMapIds.callCount).to.equal(1);
    expect(props.fetchMapIds.getCall(0).args[0]).to.equal('foo');
    expect(props.fetchMapIds.getCall(0).args[1]).to.equal('bar');
    const div = processMapsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('loading...')).to.be.true;
  });

  it('renders on failed', () => {
    const props = {
      fetchMapIds: sinon.spy(),
      agent: 'foo',
      process: 'bar',
      maps: { status: statusTypes.FAILED, error: 'unreachable' }
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);
    expect(props.fetchMapIds.callCount).to.equal(1);
    expect(props.fetchMapIds.getCall(0).args[0]).to.equal('foo');
    expect(props.fetchMapIds.getCall(0).args[1]).to.equal('bar');
    const div = processMapsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('failed to load: unreachable')).to.be.true;
  });

  it('renders on success', () => {
    const props = {
      fetchMapIds: sinon.spy(),
      agent: 'foo',
      process: 'bar',
      maps: { status: statusTypes.LOADED, mapIds: ['foo', 'bar'] }
    };
    const processMapsPage = mount(
      <MemoryRouter>
        <ProcessMapsPage {...props} />
      </MemoryRouter>
    );
    expect(props.fetchMapIds.callCount).to.equal(1);
    expect(props.fetchMapIds.getCall(0).args[0]).to.equal('foo');
    expect(props.fetchMapIds.getCall(0).args[1]).to.equal('bar');
    const links = processMapsPage.find('NavLink');
    expect(links).to.have.lengthOf(2);
    expect(links.contains('foo')).to.be.true;
    expect(links.contains('bar')).to.be.true;
  });
});
