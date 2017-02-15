/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function deprecated(oldFunc, newFunc) {
  if (!newFunc) {
    console.warn(`WARNING: ${oldFunc} is deprecated.`);
  } else {
    console.warn(`WARNING: ${oldFunc} is deprecated. Please use ${newFunc} instead.`);
  }
}
