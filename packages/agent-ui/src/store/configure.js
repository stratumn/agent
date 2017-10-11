import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import { getAgentInfo } from '../reducers';

export default function() {
  return createStore(
    combineReducers({
      agentInfo: getAgentInfo,
      routing: routerReducer
    }),
    applyMiddleware(thunk)
  );
}
