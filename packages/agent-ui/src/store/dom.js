import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import { getAgentInfo } from '../actions';
import routes from '../routes';
import { configureStore } from './';

export default function(doc) {
  const store = configureStore();
  store.dispatch(getAgentInfo());

  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>,
    doc
  );
}
