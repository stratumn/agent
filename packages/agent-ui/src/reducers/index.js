import { combineReducers } from 'redux';

const dummy = (state = null, action) => state;

const rootReducer = combineReducers({
  dummy
});

export default rootReducer;
