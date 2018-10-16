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

import React from 'react';
import PropTypes from 'prop-types';

const DummyEvidence = ({ evidence }) => {
  const { timestamp } = evidence.proof;
  const date = new Date(timestamp * 1000).toUTCString();

  return (
    <div>
      <h2>Dummy evidence</h2>
      <h4>Authority</h4>
      <p>{evidence.provider}</p>

      <h4>Time</h4>
      <p>{date}</p>
    </div>
  );
};

DummyEvidence.propTypes = {
  evidence: PropTypes.shape({
    provider: PropTypes.string,
    backend: PropTypes.string,
    proof: PropTypes.object
  }).isRequired
};

export default DummyEvidence;
