import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { TopBar, LeftDrawer, AgentInfoPage, ProcessInfoPage } from './';

export const App = ({ processes }) => (
  <MuiThemeProvider>
    <div>
      <TopBar />
      <LeftDrawer processes={processes} />
      <Route exact path="/" component={AgentInfoPage} />
      <Route exact path="/:process" component={ProcessInfoPage} />
    </div>
  </MuiThemeProvider>
);

function mapStateToProps(state) {
  console.log('mapStateToProps', state);
  let processes = [];
  if (state.agentInfo) {
    processes = Object.keys(state.agentInfo.processes);
  }
  return { processes };
}

App.propTypes = {
  processes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default withRouter(connect(mapStateToProps)(App));
