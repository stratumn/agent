import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { getAgentInfo } from '../reducers';

export default function() {
  return createStore(
    combineReducers({
      agents: getAgentInfo
    }),
    applyMiddleware(thunk, logger)
  );
}
