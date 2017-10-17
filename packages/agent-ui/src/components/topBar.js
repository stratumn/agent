import React from 'react';
// import { Route } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { withStyles } from 'material-ui/styles';

const Title = ({ location }) => (
  <Typography type="title" noWrap>
    {location.pathname}
  </Typography>
);

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    position: 'absolute',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  }
});

const TopBar = props => (
  <AppBar className={props.classes.appBar}>
    <Toolbar>
      {/* <Route path="/:rest" component={Title} {...this.props} /> */}
      <Title {...props} />
    </Toolbar>
  </AppBar>
);
export default withStyles(styles)(TopBar);
