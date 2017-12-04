import { expect } from 'chai';
import {
  addNotifications,
  removeNotifications,
  makeNotification,
  makeNewSegmentNotification
} from './notifications';
import * as actionTypes from '../constants/actionTypes';

describe('notifications actions', () => {
  it('addNotifications action', () => {
    const data = ['a', 'b', 'c'];
    const action = addNotifications(data);
    expect(action).to.deep.equal({
      type: actionTypes.ADD_NOTIFICATIONS,
      data
    });
  });

  it('removeNotifications action', () => {
    const keys = ['a', 'b', 'c'];
    const action = removeNotifications(keys);
    expect(action).to.deep.equal({
      type: actionTypes.REMOVE_NOTIFICATIONS,
      keys
    });
  });
});

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
