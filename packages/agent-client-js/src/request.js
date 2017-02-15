/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import json from 'httpplease/plugins/json';
import httpplease from 'httpplease';

const request = httpplease.use(json);

function send(method, url, args) {
  return new Promise((resolve, reject) => {
    request({ method, url, body: args }, (err, res) => {
      if (err) {
        const error = (err && err.body && err.body.meta && err.body.meta.errorMessage)
          ? new Error(err.body.meta.errorMessage)
          : err;
        error.status = err.status;
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}

export function get(url) {
  return send('GET', url);
}

export function post(url, args) {
  return send('POST', url, args);
}
