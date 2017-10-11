import React from 'react';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


const LeftDrawer = ({processes}) => {
  const menuItems = Object.keys(processes).map(p => (
    <MenuItem key={p}>{p}</MenuItem>
  ));
  console.log('leftdrawer', processes);
  return (
    <Drawer>
      {menuItems}
    </Drawer>
  );
};

export default LeftDrawer;