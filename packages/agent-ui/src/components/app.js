import React, { Component } from 'react';
import {connect} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import TopBar from './topBar';
import LeftDrawer from './leftDrawer';
import { getAgentInfo } from '../actions/getAgentInfo'

class App extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getAgentInfo());
  }

  render() {
    console.log('App render', this.props);
    return (
      <MuiThemeProvider>
        <div>
          <TopBar/>
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
