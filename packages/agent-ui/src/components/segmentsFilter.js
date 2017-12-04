import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import tableStyle from '../styles/tables';
import { validateHash } from '../utils/hashUtils';

const checkAndJoin = o => {
  if (Array.isArray(o)) {
    return o.join(' ');
  }
  return undefined;
};

const checkAndTrim = s => s && s.trim();

const checkTrimAndSplit = s => s && s.trim().split(' ');

const validatePrevLinkHash = s =>
  s === undefined || s === '' || validateHash(s);

export class SegmentsFilter extends Component {
  constructor(props) {
    super(props);
    const { filters, currentProcess } = props;
    const { mapIds, tags, prevLinkHash } = filters;
    this.state = {
      mapIds: checkAndJoin(mapIds),
      tags: checkAndJoin(tags),
      prevLinkHash,
      valid: validatePrevLinkHash(prevLinkHash),
      process: currentProcess
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePrevLinkHashChange = this.handlePrevLinkHashChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.selectProcess = this.selectProcess.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { filters } = nextProps;
    // Only overwrite our state if we are passed filters as a prop
    if (Object.keys(filters).length !== 0) {
      const { mapIds, tags, prevLinkHash } = filters;
      this.setState({
        mapIds: checkAndJoin(mapIds),
        tags: checkAndJoin(tags),
        prevLinkHash,
        valid: validatePrevLinkHash(prevLinkHash)
      });
    }
  }

  selectProcess(e) {
    this.setState({ process: e.target.value });
  }

  handleChange(key, value) {
    this.setState({ ...this.state, [key]: value });
  }

  handlePrevLinkHashChange(value) {
    this.setState({
      ...this.state,
      prevLinkHash: value,
      valid: validatePrevLinkHash(value)
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { mapIds, tags, prevLinkHash, process } = this.state;
    this.props.submitHandler({
      mapIds: checkTrimAndSplit(mapIds),
      tags: checkTrimAndSplit(tags),
      prevLinkHash: checkAndTrim(prevLinkHash),
      process
    });
  }

  handleClear(e) {
    const { process } = this.state;
    e.preventDefault();
    this.setState({
      mapIds: undefined,
      tags: undefined,
      prevLinkHash: undefined
    });
    this.props.submitHandler({ process });
  }

  renderProcessDropdown() {
    const { processes } = this.props;
    const { process } = this.state;
    return (
      <TableCell padding="dense">
        <Typography type="body2">Process:</Typography>
        <Select value={process} onChange={this.selectProcess}>
          {processes.map(p => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
    );
  }

  render() {
    const { classes, withProcesses } = this.props;

    return (
      <Table className={classes.tableFilter}>
        <TableBody>
          <TableRow>
            {withProcesses && this.renderProcessDropdown()}
            <TableCell padding="dense">
              <TextField
                label="Map IDs"
                value={this.state.mapIds || ''}
                type="text"
                onChange={e => this.handleChange('mapIds', e.target.value)}
              />
            </TableCell>
            <TableCell padding="dense">
              <TextField
                label="Prev link hash"
                value={this.state.prevLinkHash || ''}
                type="text"
                error={!this.state.valid}
                onChange={e => this.handlePrevLinkHashChange(e.target.value)}
              />
            </TableCell>
            <TableCell padding="dense">
              <TextField
                label="Tags"
                value={this.state.tags || ''}
                type="text"
                onChange={e => this.handleChange('tags', e.target.value)}
              />
            </TableCell>
            <TableCell padding="dense">
              <Button
                type="filter"
                onClick={this.handleSubmit}
                disabled={!this.state.valid}
              >
                Filter
              </Button>
            </TableCell>
            <TableCell padding="dense">
              <Button type="clear" onClick={this.handleClear}>
                Clear
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

SegmentsFilter.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  filters: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
  classes: PropTypes.shape({
    tableFilter: PropTypes.string.isRequired
  }).isRequired,

  // These props are used when segments from multiple processes are displayed
  withProcesses: PropTypes.bool,
  processes: PropTypes.arrayOf(PropTypes.string),
  currentProcess: PropTypes.string
};

SegmentsFilter.defaultProps = {
  filters: {},
  withProcesses: false,
  processes: [],
  currentProcess: undefined
};

export default withStyles(tableStyle)(SegmentsFilter);
