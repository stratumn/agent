import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const AgentInfoPage = () => <div>agent info</div>;

function mapStateToProps(state, ownProps) {
  console.log('AgentInfoPage state', state);
  console.log('AgentInfoPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(AgentInfoPage));
