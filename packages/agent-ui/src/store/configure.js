import { createStore, combineReducers, applyMiddleware } from 'redux';  
import { routerReducer } from 'react-router-redux';
import agentInfo from '../reducers/getAgentInfo';
import thunk from 'redux-thunk';

export default function configureStore() {  
  return createStore(
    combineReducers({
      agentInfo,
      routing: routerReducer
    }),
    applyMiddleware(thunk)
  );
}