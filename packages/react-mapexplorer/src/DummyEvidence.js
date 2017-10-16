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

const DummyEvidence = ({ evidence }) => {
  const dateParts = evidence.timestamp.match(
    /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
  );
  dateParts[2] -= 1; // months are zero-based
  const date = new Date(Date.UTC.apply(this, dateParts.slice(1)));

  return (
    <div>
      <h4>Authority</h4>
      <p>Dummy</p>

      <h4>Time</h4>
      <p>{date.toISOString()}</p>
    </div>
  );
};

DummyEvidence.propTypes = {
  evidence: PropTypes.shape({
    timestamp: PropTypes.string
  }).isRequired
};

export default DummyEvidence;
