import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import AgentInfoPage from './components/agentInfoPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={AgentInfoPage} />
  </Route>
);
