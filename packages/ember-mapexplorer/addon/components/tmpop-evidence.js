import Ember from 'ember';
import layout from '../templates/components/tmpop-evidence';

export default Ember.Component.extend({
  layout,

  didInsertElement() {
    this.set('evidenceComplete', this.get('evidence').state === 'COMPLETE');

    if (this.get('evidence').transactions) {
      this.set('blockNumber', Object.values(this.get('evidence').transactions)[0]);
    }
  }
});
