import { TestBed } from '@angular/core/testing';

import * as MessageModule from './message';

describe('Message', () => {
  let service: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(
      (MessageModule as any).default ??
        (MessageModule as any).Message ??
        (MessageModule as any).MessageService
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
