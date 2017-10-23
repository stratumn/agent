import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export const TopBar = ({ path }) => (
  <div
    style={{
      position: 'absolute',
      width: 'calc(100% - 240px)',
      height: '56px',
      marginLeft: '240px',
      borderStyle: 'solid'
    }}
  >
    {path}
  </div>
);

TopBar.propTypes = {
  path: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
  console.log('TopBar state', state);
  console.log('topBar ownProps', ownProps);
  return {
    path: ownProps.location.pathname
  };
}

export default withRouter(connect(mapStateToProps)(TopBar));
