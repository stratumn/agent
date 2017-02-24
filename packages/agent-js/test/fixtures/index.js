/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import fs from 'fs';
import path from 'path';

export const memoryStoreInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'memoryStoreInfo.json'))
);

export const segment1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'segment1.json')));
export const segment2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'segment2.json')));
export const segment3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'segment3.json')));
