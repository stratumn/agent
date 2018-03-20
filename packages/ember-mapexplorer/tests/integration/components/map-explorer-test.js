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

import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("map-explorer", "Integration | Component | map explorer", {
  integration: true
});

test("it renders", function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(
    hbs`{{map-explorer application="snake-eyes" mapId="57743311d6a22a8f2bd2bec1"}}`
  );

  assert.equal(
    this.$()
      .text()
      .trim(),
    ""
  );
  assert.equal(this.$().find("svg").length, 2);
});
