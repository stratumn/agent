import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { getAgentInfo } from '../actions';
import routes from '../routes';
import { configureStore } from './';

export default function(doc) {
  const store = configureStore();
  store.dispatch(getAgentInfo());

  const history = syncHistoryWithStore(browserHistory, store);

  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>,
    doc
  );
}
