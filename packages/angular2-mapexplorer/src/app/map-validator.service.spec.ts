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
