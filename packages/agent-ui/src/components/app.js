import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { TopBar, LeftDrawer, InfoPage } from './';

class App extends Component {
  // static propTypes = {
  //   processes: PropTypes.arrayOf(PropTypes.string).isRequired,
  // };

  componentDidMount() {}

  // componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div>
        <TopBar />
        <Route path="/:agent?/:process?/:detail?/:id?" component={LeftDrawer} />
        <InfoPage />
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   let processes = [];
//   if (state.agentInfo) {
//     processes = Object.keys(state.agentInfo.processes);
//   }
//   return { processes };
// }

// export default connect(mapStateToProps)(App);
export default withRouter(connect()(App));
