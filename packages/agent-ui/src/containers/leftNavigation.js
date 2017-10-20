import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const LeftNavigation = () => (
  <div
    style={{
      position: 'absolute',
      width: '240px',
      borderStyle: 'solid'
    }}
  >
    left navigation
  </div>
);

function mapStateToProps(state, ownProps) {
  console.log('LeftNavigation state', state);
  console.log('LeftNavigation ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(LeftNavigation));
