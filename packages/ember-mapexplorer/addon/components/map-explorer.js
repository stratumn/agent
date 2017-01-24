import Ember from 'ember';
import layout from '../templates/components/map-explorer';

export default Ember.Component.extend({
  layout,

  actions: {
    close() {
      this.set('segment', null);
      this.onHide();

      const onSelectSegment = this.get('onSelectSegment');
      if (onSelectSegment) {
        onSelectSegment(null);
      }
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
    this.set('builder', new mapexplorerCore.ChainTreeBuilder(this.$()[0]));

    this.get('builder').build({
      id: this.get('mapId'),
      applicationUrl: this.get('applicationUrl'),
      chainscript: this.get('chainscript')
    }, {
      onclick: this.onClick.bind(this),
      onTag: (tag) => {}
    });
  },

  didUpdateAttrs() {
    this._super(...arguments);

    // Temporary solution.
    const chainscript = this.get('chainscript');

    if (chainscript) {
      let builder = this.get('builder');
      builder.chainTree.display(chainscript, {
        ...mapexplorerCore.defaultOptions,
        onclick: this.onClick.bind(this),
        onTag: (tag) => {}
      });
    }
  },

  onClick(d, onHide) {
    this.onHide = onHide;
    this.set('segment', d.data);
    this.set('evidenceComplete', this.get('segment').meta.evidence.state === 'COMPLETE');

    const onSelectSegment = this.get('onSelectSegment');
    if (onSelectSegment) {
      onSelectSegment(this.get('segment'));
    }
  }

});
