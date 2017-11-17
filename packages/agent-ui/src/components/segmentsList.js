import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';

import progressStyle from '../styles/progress';
import * as statusTypes from '../constants/status';

export const SegmentsList = ({
  agent,
  process,
  status,
  error,
  segments,
  classes
}) => {
  switch (status) {
    case statusTypes.FAILED:
      return <Typography type="title">{`failed to load: ${error}`}</Typography>;
    case statusTypes.LOADED:
      return (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Process segments:</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {segments.map(id => (
              <TableRow key={id} hover>
                <TableCell>
                  <Typography type="title">
                    <NavLink
                      to={`/${agent}/${process}/segments/${id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {id}
                    </NavLink>
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    default:
      return <CircularProgress className={classes.circular} />;
  }
};

SegmentsList.defaultProps = {
  status: '',
  error: '',
  segments: []
};
SegmentsList.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  status: PropTypes.string,
  error: PropTypes.string,
  segments: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.shape({
    circular: PropTypes.string
  }).isRequired
};

export default withStyles(progressStyle)(SegmentsList);
