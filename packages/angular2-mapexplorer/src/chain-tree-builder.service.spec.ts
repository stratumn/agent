/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChainTreeBuilderService } from './chain-tree-builder.service';

describe('Service: ChainTreeBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChainTreeBuilderService]
    });
  });

  it('should ...', inject([ChainTreeBuilderService], (service: ChainTreeBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
