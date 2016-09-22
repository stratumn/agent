import { Injectable } from '@angular/core';
import { ChainTreeBuilder } from 'mapexplorer-core';

@Injectable()
export class ChainTreeBuilderService {

  constructor() { }

  getBuilder(element) {
    return new ChainTreeBuilder(element);
  }

  build(builder, map, options) {
    return builder.build({
      id: map.mapId,
      application: map.application,
      chainscript: map.chainscript
    }, options);
  }
}