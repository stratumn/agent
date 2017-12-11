import { expect } from 'chai';
import {
  makeNotification,
  makeNewSegmentNotification
} from './notificationHelpers';
import * as notificationTypes from '../constants/notificationTypes';

describe('notification helpers', () => {
  it('makeNotification() generates a new notification object with uuid', () => {
    const obj = { foo: 'bar', one: 2 };
    const { key, ...fromObj } = makeNotification(obj);
    expect(key).to.have.lengthOf(36);
    expect(fromObj).to.deep.equal(obj);
  });

  it('makeNewSegmentNotification() adds agent info', () => {
    const agentUrl = 'foo';
    const process = 'bar';
    const mapId = 'foo/bar';
    const linkHash = 'xyz';
    const segment = {
      link: { meta: { mapId, process } },
      meta: { linkHash, agentUrl }
    };
    const { key, ...fromObj } = makeNewSegmentNotification(segment);
    expect(fromObj).to.deep.equal({
      agentUrl,
      process,
      mapId,
      linkHash,
      type: notificationTypes.NEW_SEGMENT
    });
  });
});
