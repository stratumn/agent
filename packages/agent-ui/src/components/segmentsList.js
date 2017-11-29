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
  classes,
  handleClick
}) => {
  const getTableRow = segment => {
    const { meta: { linkHash } } = segment;
    const tableRowProps = {
      type: 'subheading',
      style: { textDecoration: 'none', cursor: 'pointer' }
    };

    if (handleClick === null) {
      tableRowProps.component = NavLink;
      tableRowProps.to = `/${agent}/${process}/segments/${linkHash}`;
    } else {
      tableRowProps.onClick = () => handleClick(segment);
    }

    return (
      <TableRow key={linkHash} hover>
        <TableCell>
          <Typography {...tableRowProps}>{linkHash}</Typography>
        </TableCell>
      </TableRow>
    );
  };

  switch (status) {
    case statusTypes.FAILED:
      return (
        <Typography type="subheading">{`failed to load: ${error}`}</Typography>
      );
    case statusTypes.LOADED:
      return segments.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography type="subheading">Process segments:</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{segments.map(getTableRow)}</TableBody>
        </Table>
      ) : (
        <Typography type="subheading" style={{ margin: 20 }}>
          No process segment found!
        </Typography>
      );
    default:
      return <CircularProgress className={classes.circular} />;
  }
};

SegmentsList.defaultProps = {
  status: '',
  error: '',
  segments: [],
  handleClick: null
};
SegmentsList.propTypes = {
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  status: PropTypes.string,
  error: PropTypes.string,
  handleClick: PropTypes.func,
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      meta: PropTypes.shape({
        linkHash: PropTypes.string.isRequired
      })
    })
  ),
  classes: PropTypes.shape({
    circular: PropTypes.string
  }).isRequired
};

export default withStyles(progressStyle)(SegmentsList);
