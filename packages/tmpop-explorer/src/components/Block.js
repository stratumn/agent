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
import Table, {
  TableBody,
  TableHead,
  TableCell,
  TableRow
} from 'material-ui/Table';
import { CircularProgress } from 'material-ui/Progress';
import Radium, { Style } from 'radium';
import TransactionList from './TransactionList';

function getRules() {
  return {
    'td, th': {
      padding: '10px 24px !important',
      height: 'inherit !important'
    },
    tr: {
      height: 'inherit !important'
    },
    'thead th': {
      fontWeight: 'bold !important'
    },
    'table.compact': {
      width: 'inherit !important'
    }
  };
}

function getStyles() {
  return {
    block: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    margin: {
      marginTop: 40
    }
  };
}

const Block = ({ block }) => {
  if (block) {
    const { header } = block;
    const { txs } = block.data;
    const rules = getRules();
    const styles = getStyles();

    return (
      <div>
        <Style rules={rules} /> <h1> Block# {header.height} </h1>
        <div style={styles.block}>
          <Table className="compact">
            <TableHead>
              <TableRow>
                <TableCell> Summary </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell> Chain ID </TableCell>
                <TableCell> {header.chain_id} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Height </TableCell>
                <TableCell> {header.height} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Timestamp </TableCell>
                <TableCell> {header.time} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Number Of Transactions</TableCell>
                <TableCell> {header.num_txs} </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table className="compact">
            <TableHead>
              <TableRow>
                <TableCell> Hashes </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell> Hash </TableCell>
                <TableCell> {header.last_commit_hash} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Previous Block </TableCell>
                <TableCell> {header.last_block_id.hash} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Validators Hash </TableCell>
                <TableCell> {header.validators_hash} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> Application Hash </TableCell>
                <TableCell> {header.app_hash} </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div style={styles.margin}>
            <Table
              style={{
                tableLayout: 'auto'
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell> Signatures </TableCell>
                  <TableCell />
                </TableRow>
                <TableRow>
                  <TableCell> Address </TableCell>
                  <TableCell> Signature </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {block.last_commit.precommits.map(precommit => {
                  if (precommit) {
                    return (
                      <TableRow key={precommit.validator_address}>
                        <TableCell>{precommit.validator_address}</TableCell>
                        <TableCell> {precommit.signature.data} </TableCell>
                      </TableRow>
                    );
                  }
                  return '';
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <div style={styles.margin}>
          <TransactionList transactions={txs} />
        </div>
      </div>
    );
  }
  return <CircularProgress />;
};

Block.propTypes = {
  block: PropTypes.shape({
    header: PropTypes.object,
    data: PropTypes.object
  }).isRequired
};

export default Radium(Block);
