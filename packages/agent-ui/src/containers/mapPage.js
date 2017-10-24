import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const MapPage = () => <div>map info</div>;

function mapStateToProps(state, ownProps) {
  console.log('MapPage state', state);
  console.log('MapPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(MapPage));
