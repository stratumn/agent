import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { withStyles } from 'material-ui/styles';
import layout from '../styles/layout';
import '../styles/style.css';

import history from '../store/history';
import { App } from './';

const Root = ({ store, persistor, classes }) => (
  <div className={classes.root}>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router history={history}>
          <Route path="/" component={App} />
        </Router>
      </PersistGate>
    </Provider>
  </div>
);

Root.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  store: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(layout)(Root);
