import React from 'react';
import PropTypes from 'prop-types';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const LeftDrawer = ({ processes }) => {
  const menuItems = processes.map(p => <MenuItem key={p}>{p}</MenuItem>);
  console.log('leftdrawer', processes);
  return <Drawer>{menuItems}</Drawer>;
};

LeftDrawer.propTypes = {
  processes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LeftDrawer;
