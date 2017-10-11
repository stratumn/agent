import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from '../routes';
import configureStore from '../store/configure';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = configureStore();
  const history = syncHistoryWithStore(browserHistory, store);
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>,
    div
  );
});
