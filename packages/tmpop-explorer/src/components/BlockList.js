/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table, {
  TableBody,
  TableHead,
  TableCell,
  TableRow
} from 'material-ui/Table';
import { Link } from 'react-router';

export default class BlockList extends Component {
  constructor(props, context) {
    super(props, context);
    this.path = context.path;
  }

  render() {
    const rowsBlocks = this.props.blocks.map(block => (
      <TableRow key={block.header.last_commit_hash}>
        <TableCell style={{ width: '100px' }}>
          <Link
            to={`${this.path}/blocks/${block.header.height}`}
            href={`${this.path}/blocks/${block.header.height}`}
          >
            {block.header.height}
          </Link>
        </TableCell>
        <TableCell style={{ width: '240px' }}>{block.header.time}</TableCell>
        <TableCell
          style={{ width: '400px', fontFamily: 'Roboto Mono, Monospace' }}
        >
          {block.header.last_commit_hash}
        </TableCell>
        <TableCell style={{ width: '120px' }}>
          {block.data.txs.length}
        </TableCell>
      </TableRow>
    ));

    return (
      <div style={{ minHeight: '400px' }}>
        <h1>Blocks</h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '100px' }}>Height</TableCell>
              <TableCell style={{ width: '240px' }}>Timestamp</TableCell>
              <TableCell style={{ width: '400px' }}>Hash</TableCell>
              <TableCell style={{ width: '120px' }}>Transactions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rowsBlocks}</TableBody>
        </Table>
      </div>
    );
  }
}

BlockList.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired
};

BlockList.contextTypes = {
  path: PropTypes.string
};
