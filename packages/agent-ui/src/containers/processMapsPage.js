import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const ProcessMapsPage = () => <div>process maps</div>;

function mapStateToProps(state, ownProps) {
  console.log('ProcessMapsPage state', state);
  console.log('ProcessMapsPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(ProcessMapsPage));
