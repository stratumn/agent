import { combineReducers } from 'redux';

import * as _statusTypes from './status';

import agents from './agents';
import maps from './maps';
import segments from './segments';

const rootReducer = combineReducers({
  agents,
  maps,
  segments
});

export const statusTypes = _statusTypes;

export default rootReducer;
