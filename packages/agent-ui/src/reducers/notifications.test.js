import { expect } from 'chai';

import notifications from './notifications';

import * as actionTypes from '../constants/actionTypes';

describe('notifications reducer', () => {
  const prevState = [{ key: 'a' }, { key: 'b' }];

  it('appends new notifications', () => {
    const newNotifications = [{ key: 'c' }, { key: 'd' }];
    const newState = notifications(prevState, {
      type: actionTypes.ADD_NOTIFICATIONS,
      data: newNotifications
    });

    expect(newState).to.deep.equal([...prevState, ...newNotifications]);
  });

  it('does not append new notifications without keys', () => {
    const newNotifications = [{ foo: 'c' }, { bar: 'd' }];
    const newState = notifications(prevState, {
      type: actionTypes.ADD_NOTIFICATIONS,
      data: newNotifications
    });

    expect(newState).to.deep.equal(prevState);
  });

  it('removes notifications', () => {
    const [old, stillValid] = prevState;
    const newState = notifications(prevState, {
      type: actionTypes.REMOVE_NOTIFICATIONS,
      keys: [old.key]
    });

    expect(newState).to.deep.equal([stillValid]);
  });

  it('does nothing on unknown keys', () => {
    const newState = notifications(prevState, {
      type: actionTypes.REMOVE_NOTIFICATIONS,
      keys: ['xyz', 'zxy']
    });

    expect(newState).to.deep.equal(prevState);
  });
});
