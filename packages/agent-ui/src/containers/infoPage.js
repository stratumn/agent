import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const InfoPage = () => (
  <div
    style={{
      position: 'absolute',
      width: 'calc(100% - 240px)',
      height: 'calc(100% - 56px)',
      marginLeft: '240px',
      marginTop: '56px',
      padding: '12px',
      borderStyle: 'solid'
    }}
  >
    info page
  </div>
);

function mapStateToProps(state, ownProps) {
  console.log('InfoPage state', state);
  console.log('InfoPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(InfoPage));
