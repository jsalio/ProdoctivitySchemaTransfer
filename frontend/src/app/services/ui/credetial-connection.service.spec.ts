import { TestBed } from '@angular/core/testing';

import { CredetialConnectionService } from './credetial-connection.service';

describe('CredetialConnectionService', () => {
  let service: CredetialConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredetialConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
