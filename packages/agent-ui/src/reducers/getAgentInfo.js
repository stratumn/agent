import { actionTypes } from '../actions';
// import initialState from './initialState';

export default function(
  state = { local: { name: 'local', url: 'http://localhost:3000' } },
  action
) {
  const { name, url, info, error } = action;
  switch (action.type) {
    case actionTypes.AGENT_INFO_SUCCESS:
      return { ...state, [name]: { name, url, info } };
    case actionTypes.AGENT_INFO_FAILURE:
      return error;
    default:
      return state;
  }
}
