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
  store: PropTypes.object.isRequired
};

export default Root;
