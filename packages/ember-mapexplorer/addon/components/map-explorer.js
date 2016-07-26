import Ember from 'ember';
import layout from '../templates/components/map-explorer';

export default Ember.Component.extend({
  layout,

  didInsertElement() {
    this.set('builder', new MapexplorerCore.ChainMapBuilder(this.$(), {}));

    this.get('builder').build({
      id: this.get('mapId'),
      application: this.get('application'),
      chainscript: this.get('chainscript')
    });
  }
});
