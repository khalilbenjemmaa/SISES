import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CountryDataService} from "../country-data-service.service";


@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styleUrls: ['./country-page.component.scss']
})
export class CountryPageComponent implements OnInit {
  countryName: string | null = null;
  countryData: any;

  constructor(private route: ActivatedRoute, private countryDataService: CountryDataService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('name');
      this.loadCountryData();
    });
  }

  loadCountryData(): void {
    this.countryDataService.getCountryData().subscribe(data => {
      this.countryData = data.countries.find((country: any) => country.name.toLowerCase() === this.countryName?.toLowerCase());
    });
  }
}
