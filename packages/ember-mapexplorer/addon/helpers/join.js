import Ember from 'ember';

export function join(items, hash) {
  const delimiter = hash.delimiter || ",";
  return items[0].join(delimiter);
}

export default Ember.Helper.helper(join);
