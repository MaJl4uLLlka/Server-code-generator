import { TestBed } from '@angular/core/testing';

import { RepositoryService } from './repository-service.service';

describe('RepositoryServiceService', () => {
  let service: RepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
