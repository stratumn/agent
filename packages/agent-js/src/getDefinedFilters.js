/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function (plugins) {
  return plugins.slice()
    .reverse()
    .map(p => p.filterSegment && p.filterSegment.bind(p))
    .filter(n => n);
}
