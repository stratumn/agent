import Ember from 'ember';
import layout from '../templates/components/bitcoin-evidence';

export default Ember.Component.extend({
  layout,

  didInsertElement() {
    this.set('evidenceComplete', this.get('evidence').state === 'COMPLETE');
  }
});
