import { expect } from 'chai';
import { addNotifications, removeNotifications } from './notifications';
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
