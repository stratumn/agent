import { combineReducers } from 'redux';

import * as _statusTypes from './status';

import agents from './agents';
import createMap from './createMap';
import maps from './maps';
import segments from './segments';

const rootReducer = combineReducers({
  agents,
  maps,
  segments,
  createMap
});

export const statusTypes = _statusTypes;

export default rootReducer;
