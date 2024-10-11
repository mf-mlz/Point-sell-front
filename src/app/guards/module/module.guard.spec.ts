import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ModuleGuard } from './module.guard';

describe('moduleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ModuleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
