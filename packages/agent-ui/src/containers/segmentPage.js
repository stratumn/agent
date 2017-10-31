import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { statusTypes } from '../reducers';

export const SegmentPage = ({ status, error, segment }) => {
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
};

SegmentPage.defaultProps = {
  error: '',
  segment: undefined
};
SegmentPage.propTypes = {
  status: PropTypes.string.isRequired,
  error: PropTypes.string,
  segment: PropTypes.shape({
    meta: PropTypes.shape({
      linkHash: PropTypes.string.isRequired
    }).isRequired
  })
};

export function mapStateToProps(state) {
  if (!state.segment) {
    return {
      error: 'No matching segment found'
    };
  }

  const { status, error, details } = state.segment;
  if (error) {
    return {
      status,
      error
    };
  }

  return {
    status,
    segment: details
  };
}

export default withRouter(connect(mapStateToProps)(SegmentPage));
