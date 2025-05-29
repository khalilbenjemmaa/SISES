import { TestBed } from '@angular/core/testing';

import { CountryDataServiceService } from './country-data-service.service';

describe('CountryDataServiceService', () => {
  let service: CountryDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
