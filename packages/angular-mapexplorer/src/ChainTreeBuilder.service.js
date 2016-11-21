import { ChainTreeBuilder } from 'mapexplorer-core';

export default class ChainTreeBuilderService {
  constructor($q) {
    this.$q = $q;
  }

  getBuilder(element) {
    return new ChainTreeBuilder(element);
  }

  build(builder, map, options) {
    return this.$q.when(builder.build({
      id: map.mapId,
      applicationUrl: map.applicationUrl,
      chainscript: map.chainscript
    }, options));
  }
}

ChainTreeBuilderService.$inject = ['$q'];
