import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CountryDataService } from "../country-data-service.service";

@Component({
  selector: 'app-page-pays',
  templateUrl: './country-page.component.html',
  styleUrls: ['./country-page.component.scss']
})
export class CountryPageComponent implements OnInit {
  nomPays: string | null = null;
  donneesPays: any;
  imageLoaded: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private countryDataService: CountryDataService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.nomPays = params.get('name');
      this.chargerDonneesPays();
    });
  }

  chargerDonneesPays(): void {
    this.countryDataService.getCountryData().subscribe(data => {
      const changedCountryName = this.nomPays?.trim().replace(/\s+/g, '').toLowerCase();
      this.donneesPays = data.countries.find((pays: any) =>
        pays.name.toLowerCase() === changedCountryName
      );
      this.imageLoaded = false;
    });
  }

  retourArriere(): void {
    this.router.navigate(['/']);
  }

  remplaceExtension(nomFichier: string): string {
    if (!nomFichier) return '';
    return nomFichier.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }
}

