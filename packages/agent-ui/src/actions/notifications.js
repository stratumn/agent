import * as actionTypes from '../constants/actionTypes';

export const addNotifications = data => ({
  type: actionTypes.ADD_NOTIFICATIONS,
  data
});

export const removeNotifications = keys => ({
  type: actionTypes.REMOVE_NOTIFICATIONS,
  keys
});
