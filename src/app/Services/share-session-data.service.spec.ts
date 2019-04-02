import { TestBed } from '@angular/core/testing';

import { ShareSessionDataService } from './share-session-data.service';

describe('ShareSessionDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareSessionDataService = TestBed.get(ShareSessionDataService);
    expect(service).toBeTruthy();
  });
});
