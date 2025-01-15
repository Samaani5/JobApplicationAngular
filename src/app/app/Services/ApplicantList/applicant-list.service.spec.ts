import { TestBed } from '@angular/core/testing';

import { ApplicantListService } from './applicant-list.service';

describe('ApplicantListService', () => {
  let service: ApplicantListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicantListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
