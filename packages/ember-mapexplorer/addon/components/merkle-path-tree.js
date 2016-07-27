import Ember from 'ember';
import layout from '../templates/components/merkle-path-tree';

export default Ember.Component.extend({
  layout,

  display() {
    this.get('tree').display(this.get('merkle-path'));
  },

  didInsertElement() {
    this.set('tree', new MapexplorerCore.MerklePathTree(this.$()));

    this.display();
  },

  didUpdateAttrs() {
    this.display();
  }
});
