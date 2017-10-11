import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import agentInfo from '../reducers/getAgentInfo';

export default function configureStore() {
  return createStore(
    combineReducers({
      agentInfo,
      routing: routerReducer
    }),
    applyMiddleware(thunk)
  );
}
