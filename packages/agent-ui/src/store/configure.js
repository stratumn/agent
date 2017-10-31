import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import rootReducer from '../reducers';

/* It's ok (even encouraged) to include the Redux dev tools in production:
 * https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f
 * If we need to improve perf, we can use redux-devtools-extension/logOnlyInProduction
 */

const config = {
  key: 'stratumn-agent-ui',
  storage,
  // only persist the agents part
  whitelist: ['agents']
};

const persistentReducer = persistReducer(config, rootReducer);

const configureStore = () => {
  const store = createStore(
    persistentReducer,
    composeWithDevTools(applyMiddleware(thunk))
  );
  const persistor = persistStore(store);
  return { persistor, store };
};

export default configureStore;
