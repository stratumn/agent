import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const Title = ({ urlPath }) => (
  <Typography type="title" noWrap>
    {urlPath}
  </Typography>
);

Title.propTypes = {
  urlPath: PropTypes.string.isRequired
};

const TopBar = ({ urlPath }) => (
  <AppBar
    style={{
      position: 'absolute',
      width: 'calc(100% - 240px)',
      marginLeft: '240px'
    }}
  >
    <Toolbar>
      <Title urlPath={urlPath} />
    </Toolbar>
  </AppBar>
);

TopBar.propTypes = {
  urlPath: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    urlPath: ownProps.location.pathname
  };
}

export default withRouter(connect(mapStateToProps)(TopBar));
