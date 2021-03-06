import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { ProcessMapsPage } from './processMapsPage';
import * as statusTypes from '../constants/status';

chai.use(sinonChai);

describe('<ProcessMapsPage />', () => {
  const requiredProps = {
    fetchMapIds: () => {},
    agent: 'foo',
    process: 'bar',
    maps: {},
    classes: { circular: '' }
  };

  it('calls fetch on mount', () => {
    const props = {
      ...requiredProps,

      fetchMapIds: sinon.spy()
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);

    expect(props.fetchMapIds.callCount).to.equal(1);
    expect(props.fetchMapIds.getCall(0).args[0]).to.equal('foo');
    expect(props.fetchMapIds.getCall(0).args[1]).to.equal('bar');
    const progress = processMapsPage.find('CircularProgress');
    expect(progress).to.have.lengthOf(1);
  });

  it('renders on loading', () => {
    const props = {
      ...requiredProps,

      fetchMapIds: sinon.spy(),
      maps: { status: statusTypes.LOADING }
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);

    expect(props.fetchMapIds.callCount).to.equal(1);
    expect(props.fetchMapIds.getCall(0).args[0]).to.equal('foo');
    expect(props.fetchMapIds.getCall(0).args[1]).to.equal('bar');
    const progress = processMapsPage.find('CircularProgress');
    expect(progress).to.have.lengthOf(1);
  });

  it('renders on failed', () => {
    const props = {
      ...requiredProps,

      fetchMapIds: sinon.spy(),
      maps: { status: statusTypes.FAILED, error: 'unreachable' }
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);

    expect(props.fetchMapIds.callCount).to.equal(1);
    expect(props.fetchMapIds.getCall(0).args[0]).to.equal('foo');
    expect(props.fetchMapIds.getCall(0).args[1]).to.equal('bar');
    const error = processMapsPage.find('Typography');
    expect(error).to.have.lengthOf(1);
    expect(error.contains('failed to load: unreachable')).to.be.true;
  });

  it('renders on success', () => {
    const props = {
      ...requiredProps,
      fetchMapIds: sinon.spy(),
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
    expect(links).to.have.lengthOf(4);
    expect(links.contains('foo')).to.be.true;
    expect(links.contains('bar')).to.be.true;
  });

  it('re renders when agent or process props changes', () => {
    const props = {
      ...requiredProps,
      fetchMapIds: sinon.spy(),
      maps: { status: statusTypes.LOADED, mapIds: [] }
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);

    processMapsPage.setProps({ ...props, agent: 'crazy' });
    expect(props.fetchMapIds.callCount).to.equal(2);
    expect(props.fetchMapIds.getCall(1).args[0]).to.equal('crazy');
    expect(props.fetchMapIds.getCall(1).args[1]).to.equal('bar');

    processMapsPage.setProps({ ...props, process: 'crazy' });
    expect(props.fetchMapIds.callCount).to.equal(3);
    expect(props.fetchMapIds.getCall(2).args[0]).to.equal('foo');
    expect(props.fetchMapIds.getCall(2).args[1]).to.equal('crazy');
  });

  it('does not re renders when other props changes', () => {
    const props = {
      fetchMapIds: sinon.spy(),
      maps: { status: statusTypes.LOADED, mapIds: [] }
    };
    const processMapsPage = mount(
      <ProcessMapsPage {...requiredProps} {...props} />
    );

    processMapsPage.setProps({ ...props, something: 'else' });
    expect(props.fetchMapIds.callCount).to.equal(1);
  });
});
