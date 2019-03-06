import { TestBed } from '@angular/core/testing';

import { WebSocketConnectionService } from './web-socket-connection.service';

describe('WebSocketConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketConnectionService = TestBed.get(WebSocketConnectionService);
    expect(service).toBeTruthy();
  });
});
