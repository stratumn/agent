import { combineReducers } from 'redux';

import agents from './agents';
import maps from './maps';
import segments from './segments';

const rootReducer = combineReducers({
  agents,
  maps,
  segments
});

export default rootReducer;
