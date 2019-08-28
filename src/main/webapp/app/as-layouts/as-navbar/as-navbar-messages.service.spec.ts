import { TestBed } from '@angular/core/testing';

import { AsNavbarMessagesService } from './as-navbar-messages.service';

describe('AsNavbarMessagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsNavbarMessagesService = TestBed.get(AsNavbarMessagesService);
    expect(service).toBeTruthy();
  });
});
