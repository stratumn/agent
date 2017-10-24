import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const ProcessSegmentsPage = () => <div>process segments</div>;

function mapStateToProps(state, ownProps) {
  console.log('ProcessSegmentsPage state', state);
  console.log('ProcessSegmentsPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(ProcessSegmentsPage));
