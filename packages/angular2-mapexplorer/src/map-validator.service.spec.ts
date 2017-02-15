/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapValidatorServiceService } from './map-validator-service.service';

describe('Service: MapValidatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapValidatorServiceService]
    });
  });

  it('should ...', inject([MapValidatorServiceService], (service: MapValidatorServiceService) => {
    expect(service).toBeTruthy();
  }));
});
