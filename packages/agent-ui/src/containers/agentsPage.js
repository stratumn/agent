import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const AgentsPage = () => <div>agents list and add</div>;

function mapStateToProps(state, ownProps) {
  console.log('AgentsPage state', state);
  console.log('AgentsPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(AgentsPage));
