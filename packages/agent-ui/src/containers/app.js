import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { TopBar, LeftNavigation, ContentPage } from './';

export const App = () => (
  <div>
    <TopBar />
    <LeftNavigation />
    <ContentPage />
  </div>
);

function mapStateToProps(state, ownProps) {
  console.log('App state', state);
  console.log('App ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(App));