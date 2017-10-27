import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import {
  AgentInfoPage,
  AgentsPage,
  MapPage,
  ProcessInfoPage,
  ProcessMapsPage,
  ProcessSegmentsPage,
  SegmentPage
} from './';

export const ContentPage = () => (
  <div
    style={{
      position: 'absolute',
      width: 'calc(100% - 240px)',
      height: 'calc(100% - 56px)',
      marginLeft: '240px',
      marginTop: '56px',
      padding: '12px',
      borderStyle: 'solid'
    }}
  >
    <Route exact path="/" component={AgentsPage} />
    <Route exact path="/:agent" component={AgentInfoPage} />
    <Route exact path="/:agent/:process" component={ProcessInfoPage} />
    <Route exact path="/:agent/:process/maps" component={ProcessMapsPage} />
    <Route
      exact
      path="/:agent/:process/segments"
      component={ProcessSegmentsPage}
    />
    <Route exact path="/:agent/:process/maps/:id" component={MapPage} />
    <Route exact path="/:agent/:process/segment/:id" component={SegmentPage} />
  </div>
);

function mapStateToProps(state, ownProps) {
  console.log('ContentPage state', state);
  console.log('ContentPage ownProps', ownProps);
  return {};
}

export default withRouter(connect(mapStateToProps)(ContentPage));
