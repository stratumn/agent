import { ChainValidator } from 'mapexplorer-core';

export default class MapValidatorService {
  constructor($q) {
    this.$q = $q;
  }

  validate(chainscript) {
    return this.$q.when(
      new ChainValidator(chainscript).validate()
    );
  }
}

MapValidatorService.$inject = ['$q'];
