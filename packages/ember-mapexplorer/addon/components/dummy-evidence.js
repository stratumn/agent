import Ember from 'ember';
import layout from '../templates/components/dummy-evidence';

export default Ember.Component.extend({
  layout,

  didInsertElement() {
    if (this.get('evidence').timestamp) {
      const dateParts = this.get('evidence').timestamp.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
      dateParts[2] -= 1; // months are zero-based
      this.set('date', new Date(Date.UTC.apply(this, dateParts.slice(1))).toISOString());
    }
  }
});
