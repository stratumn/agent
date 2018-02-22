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
import Table, { TableBody, TableRow, TableCell } from 'material-ui/Table';
import { CircularProgress } from 'material-ui/Progress';

const Status = ({ status }) => {
  if (status) {
    const nodeInfo = status.node_info;
    const pubKey = status.pub_key;
    return (
      <div>
        <h2>Node Info</h2>
        <Table className="compact">
          <TableBody>
            <TableRow>
              <TableCell>Public Key</TableCell>
              <TableCell>{pubKey.data}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Moniker</TableCell>
              <TableCell>{nodeInfo.moniker}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>{nodeInfo.version}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h2>Blockchain Info</h2>
        <Table className="compact">
          <TableBody>
            <TableRow>
              <TableCell>Latest block height</TableCell>
              <TableCell>{status.latest_block_height}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Latest block hash</TableCell>
              <TableCell>{status.latest_block_hash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Latest app hash</TableCell>
              <TableCell>{status.latest_app_hash}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
  return <CircularProgress />;
};

Status.propTypes = {
  status: PropTypes.shape({
    latest_app_hash: PropTypes.string
  })
};

Status.defaultProps = {
  status: {}
};

export default Status;
