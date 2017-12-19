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
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import { Link } from 'react-router';

const TransactionList = ({ transactions }) => {
  const rowsTransactions = transactions.map(tx => {
    const { data } = tx;
    return (
      <TableRow key={data.linkHash}>
        <TableRowColumn>
          <Link
            to={`/blocks/${tx.block.header.height}`}
            href={`/blocks/${tx.block.header.height}`}
          >
            {tx.block.header.height}
          </Link>
        </TableRowColumn>
        {data.linkHash}
        <TableRowColumn />
        <TableRowColumn style={{ maxWidth: 500, overflowX: 'scroll' }}>
          <pre>{JSON.stringify(data.link, undefined, 2)}</pre>
        </TableRowColumn>
      </TableRow>
    );
  });
  return (
    <div>
      <h1>Transactions</h1>
      <Table
        selectable={false}
        style={{ tableLayout: 'auto' }}
        fixedHeader={false}
      >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Block Height</TableHeaderColumn>
            <TableHeaderColumn>Link Hash</TableHeaderColumn>
            <TableHeaderColumn>Link</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{rowsTransactions}</TableBody>
      </Table>
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TransactionList;
