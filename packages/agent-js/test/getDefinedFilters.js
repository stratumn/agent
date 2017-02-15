/*
    Stratumn Agent Javascript Library
    Copyright (C) 2016  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import getDefinedFilters from '../src/getDefinedFilters';

describe('#getDefinedFilters()', () => {
  it('returns the defined filterSegment functions', () => {
    const p1 = {
      filterSegment() {
        return;
      }
    };
    const p2 = {};
    const plugins = [p1, p2];

    const filtered = getDefinedFilters(plugins);
    filtered.should.containEql(p1.filterSegment);
    filtered.should.have.length(1);
  });
});
