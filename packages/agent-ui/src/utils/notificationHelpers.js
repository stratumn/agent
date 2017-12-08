import { v4 as uuid } from 'uuid';

import * as notificationTypes from '../constants/notificationTypes';

export const makeNotification = args => ({
  key: uuid(),
  ...args
});

export const makeNewSegmentNotification = segment => {
  // extract info from segment
  const {
    link: { meta: { mapId, process } },
    meta: { agentUrl, linkHash }
  } = segment;
  return makeNotification({
    agentUrl,
    process,
    mapId,
    linkHash,
    type: notificationTypes.NEW_SEGMENT
  });
};
