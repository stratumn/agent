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
import agentUrl from '../../src/plugins/agentUrl';

const url = 'http://localhost';

function test(segment) {
  segment.meta.agentUrl.should.be.exactly('http://localhost');
  segment.meta.segmentUrl.should.be.exactly(`http://localhost/segments/${segment.meta.linkHash}`);
}

pluginTest(agentUrl(url), {
  '#createMap()'(segment) {
    test(segment);
  },

  '#createSegment()'(segment) {
    test(segment);
  }
});

