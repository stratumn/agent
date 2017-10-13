import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { App, AgentInfoPage, ProcessInfoPage } from './components';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={AgentInfoPage} />
    <Route path=":process" component={ProcessInfoPage} />
  </Route>
);
