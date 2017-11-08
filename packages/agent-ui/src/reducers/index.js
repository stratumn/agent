import { combineReducers } from 'redux';

import * as _statusTypes from './status';

import agents from './agents';
import appendSegment from './appendSegment';
import createMap from './createMap';
import maps from './maps';
import segment from './segment';
import segments from './segments';

const rootReducer = combineReducers({
  agents,
  maps,
  segment,
  segments,
  createMap,
  appendSegment
});

export const statusTypes = _statusTypes;

export default rootReducer;
