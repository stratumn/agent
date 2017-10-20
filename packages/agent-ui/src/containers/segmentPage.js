import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const SegmentPage = () => <div>segment info</div>;

function mapStateToProps(state, ownProps) {
  console.log('SegmentPage state', state);
  console.log('SegmentPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(SegmentPage));
