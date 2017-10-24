import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';

import { App } from './';

const Root = ({ store }) => (
  <Provider store={store}>
    <Route path="/" component={App} />
  </Provider>
);

Root.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  store: PropTypes.object.isRequired
  /* eslint-enable react/forbid-prop-types */
};

export default Root;
