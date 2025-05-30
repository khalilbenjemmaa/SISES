import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryDataService {
  private jsonUrl = 'assets/data/country-data.json';

  constructor(private http: HttpClient) {}

  getCountryData(): Observable<any> {
    return this.http.get(this.jsonUrl);
  }
}
