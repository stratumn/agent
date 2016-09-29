import Ember from 'ember';
import layout from '../templates/components/merkle-path-tree';

export default Ember.Component.extend({
  layout,

  display() {
    this.get('tree').display(this.get('merkle-path'));
  },

  didInsertElement() {
    this.set('tree', new mapexplorerCore.MerklePathTree(this.$()[0]));

    this.display();
  },

  didUpdateAttrs() {
    this.display();
  }
});
