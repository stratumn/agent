/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import getAgent from './getAgent';
import deprecated from './deprecated';
import config from './config';

export default function getApplication(name, url) {
  deprecated('getApplication(name, url)', 'getAgent(url)');

  return getAgent(url || config.applicationUrl.replace('%s', name));
}
