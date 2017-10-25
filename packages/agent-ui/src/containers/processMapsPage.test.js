import React from 'react';

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
      agent: '',
      process: '',
      maps: {}
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);
    expect(props.fetchMapIds.calledOnce).to.be.true;
    const div = processMapsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('process maps')).to.be.true;
  });

  it('renders on loading', () => {
    const props = {
      fetchMapIds: sinon.spy(),
      agent: '',
      process: '',
      maps: { status: statusTypes.LOADING }
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);
    expect(props.fetchMapIds.calledOnce).to.be.true;
    const div = processMapsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('loading...')).to.be.true;
  });

  it('renders on failed', () => {
    const props = {
      fetchMapIds: sinon.spy(),
      agent: '',
      process: '',
      maps: { status: statusTypes.FAILED, error: 'unreachable' }
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);
    expect(props.fetchMapIds.calledOnce).to.be.true;
    const div = processMapsPage.find('div');
    expect(div).to.have.lengthOf(1);
    expect(div.contains('failed to load: unreachable')).to.be.true;
  });

  it('renders on success', () => {
    const props = {
      fetchMapIds: sinon.spy(),
      agent: '',
      process: '',
      maps: { status: statusTypes.LOADED, mapIds: ['foo', 'bar'] }
    };
    const processMapsPage = mount(<ProcessMapsPage {...props} />);
    expect(props.fetchMapIds.calledOnce).to.be.true;
    const div = processMapsPage.find('div');
    expect(div).to.have.lengthOf(3);
    expect(div.contains('foo')).to.be.true;
    expect(div.contains('bar')).to.be.true;
  });
});
