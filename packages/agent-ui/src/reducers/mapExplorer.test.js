import { expect } from 'chai';

import * as actionTypes from '../constants/actionTypes';
import mapExplorer from './mapExplorer';

describe('mapExplorer reducer', () => {
  it('sets the linkHash of currently selected segment', () => {
    const mapExplorerState = mapExplorer(
      {},
      {
        type: actionTypes.MAP_EXPLORER_SELECT_SEGMENT,
        linkHash: 'lh',
        processName: 'p'
      }
    );
    expect(mapExplorerState).to.deep.equal({
      linkHash: 'lh',
      processName: 'p'
    });
  });

  it('clears state when segment details is closed', () => {
    const emptyMapExplorerState = mapExplorer(
      { linkHash: 'lh', someAwesomeProp: 'neat' },
      { type: actionTypes.MAP_EXPLORER_CLEAR_SEGMENT }
    );
    expect(emptyMapExplorerState).to.deep.equal({});
  });
});
