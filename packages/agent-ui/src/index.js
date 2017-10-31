import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import { Root } from './containers';
import { configureStore, history } from './store';

const config = configureStore();

ReactDOM.render(
  <Router history={history}>
    <Root {...config} />
  </Router>,
  document.getElementById('root')
);
