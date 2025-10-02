import { TestBed } from '@angular/core/testing';

import { MemStoreService } from './mem-store.service';

describe('MemStoreService', () => {
  let service: MemStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
