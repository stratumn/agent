import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import { expect } from 'chai';

import * as statusTypes from '../constants/status';

import { SegmentsList } from './segmentsList';

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
    const segments = mount(
      <MemoryRouter>
        <SegmentsList
          {...requiredProps}
          status={statusTypes.LOADED}
          segments={['s1', 's2']}
        />
      </MemoryRouter>
    );

    const verifyLink = (index, segmentId) => {
      expect(
        segments
          .find('NavLink')
          .at(index)
          .props().to
      ).to.equal(`/a/p/segments/${segmentId}`);
    };

    expect(segments.find('Table')).to.have.length(1);
    expect(segments.find('NavLink')).to.have.length(2);
    verifyLink(0, 's1');
    verifyLink(1, 's2');
  });
});
