import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const ActiveMenuItem = ({ match, item }) => {
  const toLink = match.url === '/' ? `/${item}` : `${match.url}/${item}`;
  return (
    <NavLink to={`${toLink}`} activeStyle={{ fontWeight: 'bold' }}>
      <MenuItem>{item}</MenuItem>
    </NavLink>
  );
};

const ActiveSubMenuItem = ({ match }) => {
  console.log('ActiveSubMenuItem', match);
  return (
    <div>
      <ActiveMenuItem item="maps" match={match} />
      <ActiveMenuItem item="segments" match={match} />
    </div>
  );
};

const LeftDrawer = ({ processes, match }) => {
  console.log('leftdrawer', match);
  const menuItems = processes.map(p => (
    <div key={p}>
      <ActiveMenuItem item={p} match={match} />
      <Route path={`/${p}`} component={ActiveSubMenuItem} {...this.props} />
    </div>
  ));
  console.log('leftdrawer', processes);
  return <Drawer>{menuItems}</Drawer>;
};

LeftDrawer.propTypes = {
  processes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LeftDrawer;
