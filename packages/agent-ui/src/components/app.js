import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { TopBar, LeftDrawer } from './';

class App extends Component {
  render() {
    console.log('App render', this.props);
    return (
      <MuiThemeProvider>
        <div>
          <TopBar />
          <LeftDrawer processes={this.props.processes} />
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  console.log('mapStateToProps', state);
  let processes = [];
  if (state.agentInfo) {
    ({ processes } = state.agentInfo);
  }
  return { processes };
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  processes: PropTypes.arrayOf(PropTypes.string).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(App);
