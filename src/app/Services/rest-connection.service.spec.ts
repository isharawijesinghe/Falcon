import { TestBed } from '@angular/core/testing';

import { RestConnectionService } from './rest-connection.service';

describe('RestConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestConnectionService = TestBed.get(RestConnectionService);
    expect(service).toBeTruthy();
  });
});
