import { Injectable } from '@angular/core';
import { ChainValidator } from 'mapexplorer-core';

@Injectable()
export class MapValidatorService {

  constructor() { }

  validate(chainscript): Promise<string> {
    return new ChainValidator(chainscript).validate();
  }
}