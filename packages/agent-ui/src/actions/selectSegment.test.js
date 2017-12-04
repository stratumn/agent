import { expect } from 'chai';

import * as actionTypes from '../constants/actionTypes';
import selectSegment from './selectSegment';

describe('selectSegment action', () => {
  it('clears state when segment is null', () => {
    const action = selectSegment(null);
    expect(action).to.deep.equal({
      type: actionTypes.MAP_EXPLORER_CLEAR_SEGMENT
    });
  });

  it('forwards linkHash when segment is not null', () => {
    const action = selectSegment({
      link: { meta: { process: 'p' } },
      meta: { linkHash: 'lh' }
    });
    expect(action).to.deep.equal({
      type: actionTypes.MAP_EXPLORER_SELECT_SEGMENT,
      linkHash: 'lh',
      processName: 'p'
    });
  });
});
