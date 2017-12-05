import { v4 as uuid } from 'uuid';

export const makeNotification = args => ({
  key: uuid(),
  ...args
});

export const makeNewSegmentNotification = (agent, process, segment) => {
  // extract mapId and linkHash
  const { link: { meta: { mapId } }, meta: { linkHash } } = segment;
  return makeNotification({ agent, process, mapId, linkHash });
};
