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

import React, { PropTypes } from 'react';
import BlockList from './BlockList';
import TransactionList from './TransactionList';

const Feed = ({ blocks, transactions }) => (
  <div className="application" style={{ width: '100%', margin: 'auto' }}>
    <BlockList blocks={blocks} />
    <TransactionList transactions={transactions} />
  </div>
);

Feed.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Feed;
