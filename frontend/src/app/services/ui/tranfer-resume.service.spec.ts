import { TestBed } from '@angular/core/testing';

import { TranferResumeService } from './tranfer-resume.service';

describe('TranferResumeService', () => {
  let service: TranferResumeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranferResumeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
