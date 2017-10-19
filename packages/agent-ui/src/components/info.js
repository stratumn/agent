import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { AgentInfoPage, ProcessInfoPage } from './';

const Info = () => (
  <div>
    <Route exact path="/:agent" component={AgentInfoPage} />
    <Route exact path="/:agent/:process" component={ProcessInfoPage} />
  </div>
);

export default withRouter(connect()(Info));
