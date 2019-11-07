import { TestBed } from '@angular/core/testing';

import { ScbService } from './scb.service';

describe('ScbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScbService = TestBed.get(ScbService);
    expect(service).toBeTruthy();
  });
});
