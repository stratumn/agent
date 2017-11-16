import React, { Component } from 'react';
import PropTypes from 'prop-types';

const checkAndJoin = o => {
  if (Array.isArray(o)) {
    return o.join(' ');
  }
  return undefined;
};

const checkAndTrim = s => s && s.trim();

const checkTrimAndSplit = s => s && s.trim().split(' ');

export class SegmentsFilter extends Component {
  constructor(props) {
    super(props);
    const { filters } = props;
    const { mapIds, tags, prevLinkHash } = filters;
    this.state = {
      mapIds: checkAndJoin(mapIds),
      tags: checkAndJoin(tags),
      prevLinkHash
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { filters } = nextProps;
    const { mapIds, tags, prevLinkHash } = filters;
    this.setState({
      mapIds: checkAndJoin(mapIds),
      tags: checkAndJoin(tags),
      prevLinkHash
    });
  }

  handleChange(key, value) {
    this.setState({ ...this.state, [key]: value });
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
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          placeholder="Map IDs"
          value={this.state.mapIds || ''}
          onChange={e => {
            this.handleChange('mapIds', e.target.value);
          }}
        />
        <input
          placeholder="Prev link hash"
          value={this.state.prevLinkHash || ''}
          onChange={e => {
            this.handleChange('prevLinkHash', e.target.value);
          }}
        />
        <input
          placeholder="Tags"
          value={this.state.tags || ''}
          onChange={e => {
            this.handleChange('tags', e.target.value);
          }}
        />
        <button type="submit">Filter</button>
        <button type="clear" onClick={this.handleClear}>
          Clear
        </button>
      </form>
    );
  }
}

SegmentsFilter.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  filters: PropTypes.object.isRequired
  /* eslint-enable react/forbid-prop-types */
};

export default SegmentsFilter;
