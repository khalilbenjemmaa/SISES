import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import {CountryDataService} from "../country-data-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent  {
  countries: any[] = [];
  filteredCountries: any[] = [];
  searchTerm: string = '';

  constructor(
    private countryDataService: CountryDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.countryDataService.getCountryData().subscribe(data => {
      this.countries = data.countries;
      this.filteredCountries = [...this.countries]; // Initialize filtered list
    });
  }

  filterCountries(): void {
    const search = this.searchTerm.trim().toLowerCase();
    if (search) {
      this.filteredCountries = this.countries.filter(country =>
        country.name.toLowerCase().includes(search)
      );
    } else {
      this.filteredCountries = [...this.countries]; // Reset to full list
    }
  }

  navigateToCountry(countryName: string): void {
    const formattedName = countryName.trim().replace(/\s+/g, '').toLowerCase();
    this.router.navigate(['/country', formattedName]);
  }
}
