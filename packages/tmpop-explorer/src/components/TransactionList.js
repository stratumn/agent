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
  TableRow,
  TableCell
} from 'material-ui/Table';
import { Link } from 'react-router';

const TransactionList = ({ transactions }) => {
  const rowsTransactions = transactions.map(tx => {
    const { data } = tx;
    return (
      <TableRow key={data.linkHash}>
        <TableCell>
          <Link
            to={`/blocks/${tx.block.header.height}`}
            href={`/blocks/${tx.block.header.height}`}
          >
            {tx.block.header.height}
          </Link>
        </TableCell>
        <TableCell>{data.linkHash}</TableCell>
        <TableCell style={{ maxWidth: 500, overflowX: 'scroll' }}>
          <pre>{JSON.stringify(data.link, undefined, 2)}</pre>
        </TableCell>
      </TableRow>
    );
  });
  return (
    <div>
      <h1>Transactions</h1>
      <Table style={{ tableLayout: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>Block Height</TableCell>
            <TableCell>Link Hash</TableCell>
            <TableCell>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rowsTransactions}</TableBody>
      </Table>
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TransactionList;
