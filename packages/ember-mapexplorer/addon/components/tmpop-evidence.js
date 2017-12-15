import Ember from 'ember';
import layout from '../templates/components/tmpop-evidence';

export default Ember.Component.extend({
  layout,

  didInsertElement() {
    this.set(
      'merklePathPresent',
      this.get('evidence').proof.merklePath.length > 0
    );
  }
});
