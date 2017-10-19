import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';
import AppStyle from '../style/app';

const Title = ({ urlPath }) => (
  <Typography type="title" noWrap>
    {urlPath}
  </Typography>
);

Title.propTypes = {
  urlPath: PropTypes.string.isRequired
};

const TopBar = ({ urlPath, style }) => (
  <AppBar className={style}>
    <Toolbar>
      <Title urlPath={urlPath} />
    </Toolbar>
  </AppBar>
);

TopBar.propTypes = {
  urlPath: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    urlPath: ownProps.location.pathname,
    style: ownProps.classes.appBar
  };
}

export default withStyles(AppStyle)(
  withRouter(connect(mapStateToProps)(TopBar))
);
