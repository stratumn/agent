import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mount } from 'enzyme';
import { expect } from 'chai';

import MapsList from './mapsList';

describe('<MapsList />', () => {
  const requiredProps = {
    agent: 'a',
    process: 'p',
    mapIds: ['m1', 'm2']
  };

  const mountMaps = (props = {}) =>
    mount(
      <MemoryRouter>
        <MapsList {...requiredProps} {...props} />
      </MemoryRouter>
    );

  it('displays a table with links to maps', () => {
    const maps = mountMaps();

    expect(maps.find('Table')).to.have.length(1);
    const tableLinks = maps.find('Typography').find('NavLink');
    expect(tableLinks).to.have.length(2);

    const verifyLink = (index, mapId) => {
      expect(tableLinks.at(index).props().to).to.equal(`/a/p/maps/${mapId}`);
    };

    verifyLink(0, 'm1');
    verifyLink(1, 'm2');
  });

  it('provides a button to view the segments of a map', () => {
    const maps = mountMaps();

    const tableButtons = maps.find('Button').find('NavLink');
    expect(tableButtons).to.have.length(2);

    const verifyLink = (index, mapId) => {
      expect(tableButtons.at(index).props().to).to.equal(
        `/a/p/segments?mapIds[]=${mapId}`
      );
    };

    verifyLink(0, 'm1');
    verifyLink(1, 'm2');
  });

  it('does not display map ids when empty', () => {
    const maps = mountMaps({ mapIds: [] });

    expect(maps.find('Typography')).to.have.length(1);
  });
});
