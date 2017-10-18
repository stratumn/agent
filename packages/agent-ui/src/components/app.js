import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { TopBar, LeftDrawer, AgentInfoPage, ProcessInfoPage } from './';

export const App = ({ processes }) => (
  <div>
    <TopBar />
    <LeftDrawer processes={processes} />
    <Route exact path="/" component={AgentInfoPage} />
    <Route exact path="/:process" component={ProcessInfoPage} />
  </div>
);

function mapStateToProps(state) {
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
