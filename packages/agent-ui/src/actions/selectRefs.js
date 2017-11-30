import * as actionTypes from '../constants/actionTypes';

export const closeSelectRefsDialog = () => ({
  type: actionTypes.SELECT_REFS_DIALOG_CLOSE
});

export const openSelectRefsDialog = () => ({
  type: actionTypes.SELECT_REFS_DIALOG_OPEN
});

export const removeRef = ref => ({
  type: actionTypes.SELECT_REFS_REMOVE,
  ref
});

export const addRef = ref => ({
  type: actionTypes.SELECT_REFS_ADD,
  ref
});

export const clearRefs = () => ({
  type: actionTypes.SELECT_REFS_CLEAR
});
