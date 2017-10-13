import React from 'react';
import { Route } from 'react-router-dom';

import { App, AgentInfoPage, ProcessInfoPage } from './components';

export default (
  <div>
    <Route path="/" component={App} />
    <Route exact path="/" component={AgentInfoPage} />
    <Route exact path="/:process" component={ProcessInfoPage} />
  </div>
);
