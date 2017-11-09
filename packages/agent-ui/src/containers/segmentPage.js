import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import getSegment from '../actions/getSegment';
import * as statusTypes from '../status';

export class SegmentPage extends Component {
  componentDidMount() {
    const { agent, process, linkHash, getSegmentIfNeeded } = this.props;
    getSegmentIfNeeded(agent, process, linkHash);
  }

  componentWillReceiveProps(nextProps) {
    const { agent, process, linkHash, getSegmentIfNeeded } = nextProps;
    getSegmentIfNeeded(agent, process, linkHash);
  }

  render() {
    const { status, error, segment } = this.props;
    if (status === statusTypes.LOADING) {
      return <div>loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!segment) {
      return <div className="error">Could not find segment</div>;
    }

    return <div>{JSON.stringify(segment, null, 2)}</div>;
  }
}

SegmentPage.defaultProps = {
  status: '',
  error: '',
  segment: undefined
};

SegmentPage.propTypes = {
  getSegmentIfNeeded: PropTypes.func.isRequired,
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  linkHash: PropTypes.string.isRequired,
  status: PropTypes.string,
  error: PropTypes.string,
  segment: PropTypes.shape({
    meta: PropTypes.shape({
      linkHash: PropTypes.string.isRequired
    })
  })
};

export function mapStateToProps(state, ownProps) {
  const { match: { params: { agent, process, id: linkHash } } } = ownProps;
  const props = {
    agent,
    process,
    linkHash
  };

  if (!state.segment) {
    return props;
  }

  const { status, error, details } = state.segment;
  props.status = status;
  props.error = error;
  props.segment = details;

  return props;
}

export default withRouter(
  connect(mapStateToProps, { getSegmentIfNeeded: getSegment })(SegmentPage)
);
