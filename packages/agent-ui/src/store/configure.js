import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';

/* It's ok (even encouraged) to include the Redux dev tools in production:
 * https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f
 * If we need to improve perf, we can use redux-devtools-extension/logOnlyInProduction
 */
const configureStore = () =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default configureStore;
