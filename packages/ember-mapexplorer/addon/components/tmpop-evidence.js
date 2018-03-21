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

import Component from "@ember/component";
import layout from "../templates/components/tmpop-evidence";

export default Component.extend({
  layout,

  didInsertElement() {
    this.set(
      "merklePathPresent",
      this.get("evidence").proof.merkle_path.length > 0
    );

    this.set(
      "votes",
      this.get("evidence").proof.header_votes.map(v => v.vote.validator_address)
    );

    this.set(
      "validators",
      this.get("evidence").proof.header_validator_set.validators.map(
        v => v.address
      )
    );

    this.set(
      "nextVotes",
      this.get("evidence").proof.header_votes.map(v => v.vote.validator_address)
    );

    this.set(
      "nextValidators",
      this.get("evidence").proof.next_header_validator_set.validators.map(
        v => v.address
      )
    );
  }
});
