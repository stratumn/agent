import Ember from 'ember';
import layout from '../templates/components/map-explorer';

export default Ember.Component.extend({
  layout,


  actions: {
    close() {
      this.set('segment', null);
      d3.selectAll('g.node.selected').classed('selected', false);
    },
    show(part) {
      ['state', 'link', 'evidence', 'json'].forEach((part) => this.set(part + 'Showed', false));
      this.set(part + 'Showed', true);
    }
  },

  init() {
    this._super(...arguments);
    this.set('stateShowed', true);
  },

  didInsertElement() {
    this.set('builder', new MapexplorerCore.ChainMapBuilder(this.$(), {
      onclick: d => {
        this.set('segment', d.data);
        this.set('evidenceComplete', this.get('segment').meta.evidence.state === 'COMPLETE');
      }
    }));

    this.get('builder').build({
      id: this.get('mapId'),
      application: this.get('application'),
      chainscript: this.get('chainscript')
    });
  }
});
