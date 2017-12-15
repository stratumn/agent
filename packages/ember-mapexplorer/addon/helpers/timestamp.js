import Ember from 'ember';

export function timestamp(params) {
  return new Date(params * 1000).toUTCString();
}

export default Ember.Helper.helper(timestamp);
