import Ember from 'ember';
import layout from '../templates/components/evidences-component';

export default Ember.Component.extend({
  layout,

  evidenceComponents: {
    TMPop: 'tmpop-evidence',
    bcbatch: 'bitcoin-evidence',
    dummy: 'dummy-evidence'
  },

  didReceiveAttrs() {
    this.set(
      'evidences',
      this.get('evidences').map(e =>
        Object.assign(e, { component: this.evidenceComponents[e.backend] })
      )
    );
  }
});
