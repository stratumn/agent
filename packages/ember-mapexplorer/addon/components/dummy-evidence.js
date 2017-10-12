import Ember from 'ember';
import layout from '../templates/components/dummy-evidence';

export default Ember.Component.extend({
  layout,

  didInsertElement() {
    if (this.get('evidence').proof) {
      const timestamp = this.get('evidence').proof.timestamp;
      this.set('date', new Date(timestamp * 1000).toUTCString());
    }
  }
});
