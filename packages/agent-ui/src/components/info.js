import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { AgentInfoPage, ProcessInfoPage, MapsInfoPage } from './';

const Info = () => (
  <div>
    <Route exact path="/:agent" component={AgentInfoPage} />
    <Route exact path="/:agent/:process" component={ProcessInfoPage} />
    <Route exact path="/:agent/:process/maps" component={MapsInfoPage} />
  </div>
);

export default withRouter(connect()(Info));
