import {TestBed} from '@angular/core/testing';

import {InjectionComponentService} from './injection-component.service';

describe('InjectionComponentService', () => {
  let service: InjectionComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjectionComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
