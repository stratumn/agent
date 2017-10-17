import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';

const Title = ({ urlPath }) => (
  <Typography type="title" noWrap>
    {urlPath}
  </Typography>
);

Title.propTypes = {
  urlPath: PropTypes.string.isRequired
};

const drawerWidth = 240;

const styles = () => ({
  appBar: {
    position: 'absolute',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  }
});

const TopBar = ({ style, urlPath }) => (
  <AppBar className={style}>
    <Toolbar>
      <Title urlPath={urlPath} />
    </Toolbar>
  </AppBar>
);

TopBar.propTypes = {
  style: PropTypes.string.isRequired,
  urlPath: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    style: ownProps.classes.appBar,
    urlPath: ownProps.location.pathname
  };
}

export default withStyles(styles)(withRouter(connect(mapStateToProps)(TopBar)));
