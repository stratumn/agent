/*
    Stratumn Agent Javascript Library
    Copyright (C) 2017  Stratumn SAS

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

import pluginTest from '.';
import stateHash from '../../src/plugins/stateHash';
import hashJson from '../../src/hashJson';

pluginTest(stateHash, {
  '#createMap()'(segment) {
    segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3 }));
  },

  '#createSegment()'(segment) {
    segment.link.meta.stateHash.should.be.exactly(hashJson({ a: 1, b: 2, c: 3, d: 4 }));
  }
});

