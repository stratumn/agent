import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const TopBar = () => (
  <div
    style={{
      position: 'absolute',
      width: 'calc(100% - 240px)',
      height: '56px',
      marginLeft: '240px',
      borderStyle: 'solid'
    }}
  >
    top bar
  </div>
);

function mapStateToProps(state, ownProps) {
  console.log('TopBar state', state);
  console.log('topBar ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(TopBar));
