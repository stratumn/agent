import Ember from 'ember';

export function json(params) {
  return JSON.stringify(params, undefined, 2);
}

export default Ember.Helper.helper(json);
