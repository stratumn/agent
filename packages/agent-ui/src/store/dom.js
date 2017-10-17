import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from '../components';
import { getAgentInfo } from '../actions';
import { configureStore } from './';

const agentUrl = 'http://localhost:3000';

export default function(doc) {
  const store = configureStore();
  store.dispatch(getAgentInfo(agentUrl));

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    doc
  );
}
