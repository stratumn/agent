import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Button from 'material-ui/Button';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';

const MapsList = ({ agent, process, mapIds }) =>
  mapIds.length ? (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="subheading">Process maps:</Typography>
          </TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {mapIds.map(id => (
          <TableRow key={id} hover>
            <TableCell>
              <Typography
                variant="subheading"
                component={NavLink}
                to={`/${agent}/${process}/maps/${id}`}
                style={{ textDecoration: 'none' }}
              >
                {id}
              </Typography>
            </TableCell>
            <TableCell numeric>
              <Button
                component={NavLink}
                to={`/${agent}/${process}/segments?mapIds[]=${id}`}
              >
                View segments
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <Typography variant="subheading" style={{ margin: 20 }}>
      No process map found!
    </Typography>
  );

MapsList.defaultProps = {
  mapIds: []
};
MapsList.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  mapIds: PropTypes.arrayOf(PropTypes.string)
};

export default MapsList;
