import React, { Component } from 'react';
import {connect} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


const LeftDrawer = ({processes}) => {
  // const menuItems = [];
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
class App extends Component {
  render() {
    console.log('App render', this.props);
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Agent info" />
          <LeftDrawer processes={this.props.processes} />
        </div>
      </MuiThemeProvider>
    )
  }
}


function mapStateToProps(state, ownProps) {
  console.log('mapStateToProps', state);
  let processes = [];
  if (state.agentInfo) {
    processes = state.agentInfo.processes;
  }
  return { processes };
} 

export default connect(mapStateToProps)(App);  