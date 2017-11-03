import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { history } from '../store';
import { App } from './';

const Root = ({ store, persistor }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <Router history={history}>
        <Route path="/" component={App} />
      </Router>
    </PersistGate>
  </Provider>
);

Root.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  store: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired
  /* eslint-enable react/forbid-prop-types */
};

export default Root;
