import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const ProcessInfoPage = () => <div>process info</div>;

function mapStateToProps(state, ownProps) {
  console.log('ProcessInfoPage state', state);
  console.log('ProcessInfoPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(ProcessInfoPage));
