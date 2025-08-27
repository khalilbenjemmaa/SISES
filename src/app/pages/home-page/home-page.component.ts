import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { CountryDataService } from "../../country-data-service.service";
import { Router } from "@angular/router";
import { AnimationService } from '../../animation.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  countries: any[] = [];
  filteredCountries: any[] = [];
  searchTerm: string = '';
  showMap: boolean = false;

  constructor(
    private countryDataService: CountryDataService,
    private router: Router,
    private animationService: AnimationService
  ) { }


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

  navigateToCountry(countryName: string, event: MouseEvent): void {
    const card = (event.currentTarget as HTMLElement);
    this.animationService.cardRect = card.getBoundingClientRect();
    const country = this.countries.find(c => c.name === countryName);
    this.animationService.imageUrl = '/assets/img/country-page/' + this.remplaceExtension(country['bg-image']);

    const formattedName = countryName.trim().replace(/\s+/g, '').toLowerCase();
    this.router.navigate(['/country', formattedName]);
  }

  remplaceExtension(nomFichier: string): string {
    if (!nomFichier) return '';
    return nomFichier.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  trackByCountry(index: number, country: any): string {
    return country.name; // Use a unique property like name or an id
  }

  nextSlide(): void {
    const carousel = document.querySelector('#hero-carousel');
    if (carousel) {
      const bsCarousel = (window as any).bootstrap?.Carousel?.getInstance(carousel) ||
        new (window as any).bootstrap.Carousel(carousel);
      bsCarousel.next();
    }
  }
}
