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

import React from 'react';
import PropTypes from 'prop-types';

const TMPopHeader = ({ header, votes, validators }) => (
  <div>
    <h4>Block #</h4>
    <p>{header.height}</p>

    <h4>Time</h4>
    <p>{header.time}</p>

    <h4>Last Block</h4>
    <p>{header.last_block_id.hash}</p>

    <h4>App Hash</h4>
    <p>{header.app_hash}</p>

    <h4>Validators Hash</h4>
    <p>{header.validators_hash}</p>

    <h4>Validators</h4>
    <p>{votes.map(v => v.vote.validator_address)}</p>

    <h4>Expected Validators</h4>
    <p>{validators.map(v => v.address)}</p>
  </div>
);

TMPopHeader.defaultProps = {
  votes: []
};

TMPopHeader.propTypes = {
  header: PropTypes.shape({
    app_hash: PropTypes.string,
    height: PropTypes.number,
    last_block_id: PropTypes.shape({
      hash: PropTypes.string
    }),
    time: PropTypes.string,
    validators_hash: PropTypes.string
  }).isRequired,
  votes: PropTypes.arrayOf(
    PropTypes.shape({
      vote: PropTypes.shape({
        validator_address: PropTypes.string
      })
    })
  ),
  validators: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string
    })
  ).isRequired
};

export default TMPopHeader;
