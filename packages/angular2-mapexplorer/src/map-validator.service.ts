/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Injectable } from '@angular/core';
import { ChainValidator } from 'mapexplorer-core';

@Injectable()
export class MapValidatorService {

  constructor() { }

  validate(chainscript): Promise<string> {
    return new ChainValidator(chainscript).validate();
  }
}
