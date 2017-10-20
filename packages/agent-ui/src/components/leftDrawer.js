import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { NavLink, Route, withRouter } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';
import { MenuItem } from 'material-ui/Menu';

import { withStyles } from 'material-ui/styles';
import AppStyle from '../style/app';

const ActiveMenuItem = ({ match, item }) => {
  const toLink = match.url === '/' ? `/${item}` : `${match.url}/${item}`;
  return (
    <NavLink to={`${toLink}`} activeStyle={{ fontWeight: 'bold' }}>
      <MenuItem>{item}</MenuItem>
    </NavLink>
  );
};

ActiveMenuItem.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  item: PropTypes.string.isRequired
};

const ActiveSubMenuItem = ({ match }) => (
  <div>
    <ActiveMenuItem item="maps" match={match} />
    <ActiveMenuItem item="segments" match={match} />
  </div>
);

ActiveSubMenuItem.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  }).isRequired
};

const LeftDrawer = ({ processes, match, classes }) => {
  const menuItems = processes.map(p => (
    <div key={p} className={classes.leftDrawer}>
      <ActiveMenuItem item={p} match={match} />
      <Route path={`/${p}`} component={ActiveSubMenuItem} />
    </div>
  ));
  return <Drawer type="permanent">{menuItems}</Drawer>;
};

LeftDrawer.propTypes = {
  processes: PropTypes.arrayOf(PropTypes.string).isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  classes: PropTypes.shape({
    leftDrawer: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(AppStyle)(withRouter(LeftDrawer));
