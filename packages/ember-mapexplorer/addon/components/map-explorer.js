/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

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
    this.set('evidence-component', 'bitcoin-component');
  },

  didInsertElement() {
    this.set('builder', new mapexplorerCore.ChainTreeBuilder(this.$()[0]));
    this.detectEvidenceComponent();

    this.get('builder').build({
      id: this.get('mapId'),
      applicationUrl: this.get('applicationUrl'),
      chainscript: this.get('chainscript')
    }, {
      onclick: this.onClick.bind(this),
      onTag: () => {}
    });
  },

  didUpdateAttrs() {
    this._super(...arguments);


    // Temporary solution.
    const chainscript = this.get('chainscript');

    if (chainscript) {
      let builder = this.get('builder');
      builder.chainTree.display(chainscript, Object.assign(mapexplorerCore.defaultOptions, {
        onclick: this.onClick.bind(this),
        onTag: () => {}
      }));

      this.detectEvidenceComponent(chainscript);
    }
  },

  onClick(d, onHide) {
    this.onHide = onHide;
    this.set('segment', d.data);

    const onSelectSegment = this.get('onSelectSegment');
    if (onSelectSegment) {
      onSelectSegment(this.get('segment'));
    }
  },

  detectEvidenceComponent() {
    let chainscript = this.get('chainscript');
    if (chainscript && chainscript.length > 0) {
      if (typeof(chainscript) !== 'object') {
        chainscript = JSON.parse(chainscript);
      }
      const evidence = chainscript[0].meta.evidence;
      let transactionKey;
      if (evidence.transactions) {
        transactionKey = Object.keys(evidence.transactions)[0];
      }
      let component;
      if (/bitcoin/.test(transactionKey)) {
        component = 'bitcoin-evidence';
      } else if (/TMPop/.test(transactionKey)) {
        component = 'tmpop-evidence';
      } else if (evidence.timestamp) {
        component = 'dummy-evidence';
      }

      if (component) {
        this.set('evidence-component', component);
      }
    }
  }
});
