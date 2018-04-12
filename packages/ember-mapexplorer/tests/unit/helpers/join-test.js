/*
  Copyright 2017 Stratumn SAS. All rights reserved.

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

import { join } from "dummy/helpers/join";
import { module, test } from "qunit";

module("Unit | Helper | join");

test("it works", function(assert) {
  let result = join([[42, 43]], { delimiter: ", " });
  assert.ok(result === "42, 43");
});

test("it works with attribute", function(assert) {
  let result = join([[{ test: 42 }, { test: 43 }]], {
    attribute: "test",
    delimiter: ", "
  });
  assert.ok(result === "42, 43");
});
