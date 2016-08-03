import { ChainTreeBuilder } from 'mapexplorer-core';

export default class ChainTreeBuilderService {
  constructor($q) {
    this.$q = $q;
  }

  getBuilder(element, options) {
    return new ChainTreeBuilder(element, options);
  }

  build(builder, map) {
    return this.$q.when(builder.build({
      id: map.mapId,
      application: map.application,
      chainscript: map.chainscript
    }));
  }
}

ChainTreeBuilderService.$inject = ['$q'];
