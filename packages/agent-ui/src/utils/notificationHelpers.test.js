import 'babel-polyfill';
import { expect } from 'chai';
import {
  makeNotification,
  makeNewSegmentNotification
} from './notificationHelpers';

describe('notification helpers', () => {
  it('makeNotification() generates a new notification object with uuid', () => {
    const obj = { foo: 'bar', one: 2 };
    const { key, ...fromObj } = makeNotification(obj);
    expect(key).to.have.lengthOf(36);
    expect(fromObj).to.deep.equal(obj);
  });

  it('makeNewSegmentNotification() adds agent info', () => {
    const agent = 'foo';
    const process = 'bar';
    const mapId = 'foo/bar';
    const linkHash = 'xyz';
    const obj = {
      agent,
      process,
      segment: {
        link: { meta: { mapId } },
        meta: { linkHash }
      }
    };
    const { key, ...fromObj } = makeNewSegmentNotification(
      ...Object.values(obj)
    );
    expect(fromObj).to.deep.equal({ agent, process, mapId, linkHash });
  });
});
