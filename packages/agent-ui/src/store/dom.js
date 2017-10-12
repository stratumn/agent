import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { getAgentInfo } from '../actions';
import { configureStore } from './';

import routes from '../routes';

export default function(doc) {
  const store = configureStore();
  store.dispatch(getAgentInfo());

  ReactDOM.render(
    <Provider store={store}>
      <Router>{routes}</Router>
    </Provider>,
    doc
  );
}
