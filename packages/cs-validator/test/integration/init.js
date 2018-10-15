/*
  Copyright 2016-2018 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import mock from 'xhr-mock';
import _2a4 from '../fixtures/2a443211e871f58a6ee5a93e62ce36cac2ddfc0f05a6bec1e7b11aa8d5e4cf38.json';
import _d25 from '../fixtures/d25a285b50204e1b0ca7472035d73cae93faea06ddac120800dd6aacca006688.json';

// replace the real XHR object with the mock XHR object
mock.setup();

mock.get(
  'https://api.blockcypher.com/v1/btc/main/txs/2a443211e871f58a6ee5a93e62ce36cac2ddfc0f05a6bec1e7b11aa8d5e4cf38',
  (req, res) =>
    res
      .status(200)
      .header('Content-Type', 'application/json')
      .body(JSON.stringify(_2a4))
);

mock.get(
  'https://api.blockcypher.com/v1/btc/main/txs/d25a285b50204e1b0ca7472035d73cae93faea06ddac120800dd6aacca006688',
  (req, res) =>
    res
      .status(200)
      .header('Content-Type', 'application/json')
      .body(JSON.stringify(_d25))
);
