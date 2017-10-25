import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Root from './containers/root';
// import { Root } from './containers';
import { configureStore } from './store';

const config = configureStore();

ReactDOM.render(
  <Router>
    <Root {...config} />
  </Router>,
  document.getElementById('root')
);
