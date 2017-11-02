import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getSegment } from '../actions';
import { statusTypes } from '../reducers';

export class SegmentPage extends Component {
  componentDidMount() {
    const { agent, process, linkHash, refresh, getSegmentAction } = this.props;
    if (refresh) {
      getSegmentAction(agent, process, linkHash);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { agent, process, linkHash, refresh, getSegmentAction } = nextProps;
    if (refresh) {
      getSegmentAction(agent, process, linkHash);
    }
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

    return <div>{JSON.stringify(segment)}</div>;
  }
}

SegmentPage.defaultProps = {
  status: '',
  error: '',
  segment: undefined
};

SegmentPage.propTypes = {
  getSegmentAction: PropTypes.func.isRequired,
  agent: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  linkHash: PropTypes.string.isRequired,
  refresh: PropTypes.bool.isRequired,
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
    linkHash,
    refresh: true
  };

  if (!state.segment) {
    return props;
  }

  const { status, error, details } = state.segment;
  props.status = status;

  if (status === statusTypes.LOADING) {
    props.refresh = false;
  } else if (status === statusTypes.FAILED) {
    props.refresh = false;
    props.error = error;
  } else {
    props.refresh = !details || details.meta.linkHash !== linkHash;
    props.segment = details;
  }

  return props;
}

export default withRouter(
  connect(mapStateToProps, { getSegmentAction: getSegment })(SegmentPage)
);
