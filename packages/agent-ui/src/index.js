import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';

import { Root } from './containers';
import { configureStore } from './store';

const config = configureStore();

ReactDOM.render(<Root {...config} />, document.getElementById('root'));
