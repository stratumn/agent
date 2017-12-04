import { v4 as uuid } from 'uuid';
import * as actionTypes from '../constants/actionTypes';

export const addNotifications = data => ({
  type: actionTypes.ADD_NOTIFICATIONS,
  data
});

export const removeNotifications = keys => ({
  type: actionTypes.REMOVE_NOTIFICATIONS,
  keys
});

export const makeNotification = args => ({
  key: uuid(),
  ...args
});

export const makeNewSegmentNotification = (agent, process, segment) => {
  // extract mapId and linkHash
  const { link: { meta: { mapId } }, meta: { linkHash } } = segment;
  return makeNotification({ agent, process, mapId, linkHash });
};
