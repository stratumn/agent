import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import { connect } from "react-redux";
import { withRouter, Route } from "react-router-dom";

import { TopBar, LeftDrawer, InfoPage } from "./";
import { getAgentInfo } from "../actions";

class AppContent extends Component {
  static propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { agent } = match.params;
    if (agent) dispatch(getAgentInfo(agent));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = nextProps;
    if (this.props.match.params.agent !== match.params.agent)
      dispatch(getAgentInfo(match.params.agent));
  }

  render() {
    return (
      <div>
        <TopBar />
        <LeftDrawer />
        <InfoPage />
      </div>
    );
  }
}

const AppContentConnected = withRouter(connect()(AppContent));

const App = () => (
  <Route
    path="/:agent?/:process?/:detail?/:id?"
    component={AppContentConnected}
  />
);

export default withRouter(connect()(App));
