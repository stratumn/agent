import * as actionTypes from '../constants/actionTypes';

const initialState = {
  show: false,
  refs: []
};

const onlyAddNewRef = (state, newRef) => {
  if (state.refs.findIndex(ref => ref.linkHash === newRef.linkHash) >= 0) {
    return state;
  }

  return {
    ...state,
    refs: [...state.refs, newRef]
  };
};

const selectRefsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_REFS_DIALOG_OPEN:
      return {
        ...state,
        show: true
      };
    case actionTypes.SELECT_REFS_DIALOG_CLOSE:
      return {
        ...state,
        show: false
      };
    case actionTypes.SELECT_REFS_REMOVE:
      return {
        ...state,
        refs: state.refs.filter(ref => action.ref.linkHash !== ref.linkHash)
      };
    case actionTypes.SELECT_REFS_ADD:
      return onlyAddNewRef(state, action.ref);
    case actionTypes.SELECT_REFS_CLEAR:
      return {
        ...state,
        refs: []
      };
    default:
      return state;
  }
};

export default selectRefsReducer;
