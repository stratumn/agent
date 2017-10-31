import { PersistGate } from 'redux-persist/lib/integration/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';

import { App } from './';

const Root = ({ store, persistor }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <Route path="/" component={App} />
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
