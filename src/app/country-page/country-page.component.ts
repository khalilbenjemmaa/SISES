import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common'; // Importer Location pour la navigation
import { CountryDataService } from "../country-data-service.service";

@Component({
  selector: 'app-page-pays',
  templateUrl: './country-page.component.html',
  styleUrls: ['./country-page.component.scss']
})
export class CountryPageComponent implements OnInit {
  nomPays: string | null = null;
  donneesPays: any;

  constructor(
    private route: ActivatedRoute,
    private countryDataService: CountryDataService,
    private location: Location, // Injecter Location
    private router: Router
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.nomPays = params.get('name');
      this.chargerDonneesPays();
    });
  }

  // Charger les données du pays
  chargerDonneesPays(): void {
    this.countryDataService.getCountryData().subscribe(data => {
      const changedCountryName = this.nomPays?.trim().replace(/\s+/g, '').toLowerCase();
      this.donneesPays = data.countries.find((pays: any) => pays.name.toLowerCase() === changedCountryName);
    });
  }

  // Naviguer en arrière
  retourArriere(): void {
    this.router.navigate(['/']);
  }
}
