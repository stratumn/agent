import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as statusTypes from '../constants/status';

import { SegmentsList } from './segmentsList';

chai.use(sinonChai);

describe('<SegmentsList />', () => {
  const requiredProps = {
    agent: 'a',
    process: 'p',
    classes: { circular: '' }
  };

  it('displays a loading screen', () => {
    const segments = mount(<SegmentsList {...requiredProps} />);
    expect(segments.find('CircularProgress')).to.have.length(1);
  });

  it('displays an error message', () => {
    const segments = mount(
      <SegmentsList
        {...requiredProps}
        status={statusTypes.FAILED}
        error="much failed"
      />
    );

    expect(segments.find('CircularProgress')).to.have.length(0);
    expect(segments.find('Typography')).to.have.length(1);
    expect(segments.find('Typography').text()).to.equal(
      'failed to load: much failed'
    );
  });

  it('displays a table with links to segments', () => {
    const linkHashes = ['s1', 's2'];
    const segments = linkHashes.map(l => ({ meta: { linkHash: l } }));

    const segmentsList = mount(
      <MemoryRouter>
        <SegmentsList
          {...requiredProps}
          status={statusTypes.LOADED}
          segments={segments}
        />
      </MemoryRouter>
    );

    const verifyLink = (index, segmentId) => {
      expect(
        segmentsList
          .find('NavLink')
          .at(index)
          .props().to
      ).to.equal(`/a/p/segments/${segmentId}`);
    };

    expect(segmentsList.find('Table')).to.have.length(1);
    expect(segmentsList.find('NavLink')).to.have.length(2);
    verifyLink(0, linkHashes[0]);
    verifyLink(1, linkHashes[1]);
  });

  it('displays a table with segment actions', () => {
    const linkHashes = ['s1', 's2'];
    const segments = linkHashes.map(l => ({ meta: { linkHash: l } }));
    const handleClick = sinon.spy();

    const segmentsList = mount(
      <MemoryRouter>
        <SegmentsList
          {...requiredProps}
          status={statusTypes.LOADED}
          segments={segments}
          handleClick={handleClick}
        />
      </MemoryRouter>
    );

    expect(segmentsList.find('Table')).to.have.length(1);
    expect(segmentsList.find('TableBody').find('Typography')).to.have.length(2);
    segments.forEach((segment, index) => {
      const segmentRow = segmentsList
        .find('TableBody')
        .find('Typography')
        .at(index);
      segmentRow.simulate('click');
      expect(handleClick.callCount).to.equal(index + 1);
      expect(handleClick.getCall(index).args[0]).to.deep.equal(segment);
    });
  });

  it('does not display segments or filters when empty', () => {
    const segments = mount(
      <MemoryRouter>
        <SegmentsList
          {...requiredProps}
          status={statusTypes.LOADED}
          segments={[]}
        />
      </MemoryRouter>
    );
    expect(segments.find('Typography')).to.have.length(1);
  });
});
