import { TestBed } from '@angular/core/testing';

import { StateDaoService } from './state-dao.service';

describe('StateDaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateDaoService = TestBed.get(StateDaoService);
    expect(service).toBeTruthy();
  });
});
