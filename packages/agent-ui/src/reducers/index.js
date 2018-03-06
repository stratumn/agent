import { combineReducers } from 'redux';

import agents from './agents';
import uploadKey from './uploadKey';
import appendSegment from './appendSegment';
import createMap from './createMap';
import maps from './maps';
import mapExplorer from './mapExplorer';
import segment from './segment';
import segments from './segments';
import selectRefs from './selectRefs';
import signedAttributes from './signedAttributes';
import notifications from './notifications';

const rootReducer = combineReducers({
  agents,
  key: uploadKey,
  maps,
  mapExplorer,
  segment,
  segments,
  createMap,
  appendSegment,
  selectRefs,
  signedAttributes,
  notifications
});

export default rootReducer;
