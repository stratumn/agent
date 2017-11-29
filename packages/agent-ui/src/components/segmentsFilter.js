import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';
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
    const { filters } = props;
    const { mapIds, tags, prevLinkHash } = filters;
    this.state = {
      mapIds: checkAndJoin(mapIds),
      tags: checkAndJoin(tags),
      prevLinkHash,
      valid: validatePrevLinkHash(prevLinkHash)
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePrevLinkHashChange = this.handlePrevLinkHashChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { filters } = nextProps;
    const { mapIds, tags, prevLinkHash } = filters;
    this.setState({
      mapIds: checkAndJoin(mapIds),
      tags: checkAndJoin(tags),
      prevLinkHash,
      valid: validatePrevLinkHash(prevLinkHash)
    });
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
    const { mapIds, tags, prevLinkHash } = this.state;
    this.props.submitHandler({
      mapIds: checkTrimAndSplit(mapIds),
      tags: checkTrimAndSplit(tags),
      prevLinkHash: checkAndTrim(prevLinkHash)
    });
  }

  handleClear(e) {
    e.preventDefault();
    this.props.submitHandler({});
  }

  render() {
    const { classes } = this.props;

    return (
      <Table className={classes.tableFilter}>
        <TableBody>
          <TableRow>
            <TableCell>
              <TextField
                label="Map IDs"
                value={this.state.mapIds || ''}
                type="text"
                onChange={e => this.handleChange('mapIds', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <TextField
                label="Prev link hash"
                value={this.state.prevLinkHash || ''}
                type="text"
                error={!this.state.valid}
                onChange={e => this.handlePrevLinkHashChange(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <TextField
                label="Tags"
                value={this.state.tags || ''}
                type="text"
                onChange={e => this.handleChange('tags', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button
                type="filter"
                onClick={this.handleSubmit}
                disabled={!this.state.valid}
              >
                Filter
              </Button>
            </TableCell>
            <TableCell>
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
  filters: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  classes: PropTypes.shape({
    tableFilter: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(tableStyle)(SegmentsFilter);
