import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import {Router} from "@angular/router";

interface Country {
  name: string;
  capital: string;
  population: string;
  area: string;
  continent: string;
  description?: string;
}

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class WorldMapComponent implements OnInit {
  @Output() countrySelected = new EventEmitter<Country>();

  svgContent: string = '';
  countries: { [code: string]: Country } = {};
  selectedCountry: Country | null = null;
  hoveredCountryId: string | null = null;
  tooltipX: number = 0;
  tooltipY: number = 0;
  showTooltip: boolean = false;
  isCountryLocked: boolean = false;
  lockedCountryPath: SVGPathElement | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg',
      { responseType: 'text' })
      .subscribe(data => {
        this.svgContent = data;
        setTimeout(() => this.initializeMap(), 100);
      });

    this.initializeCountryData();
  }

  initializeMap(): void {
    const svgElement = document.querySelector('#world-map svg') as SVGElement;

    if (svgElement) {
      if (!svgElement.getAttribute('viewBox')) {
        const width = svgElement.getAttribute('width') || '1200';
        const height = svgElement.getAttribute('height') || '600';
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svgElement.removeAttribute('width');
        svgElement.removeAttribute('height');
      }

      const idsToRemove = ['east antarctica', 'antarctic peninsula', 'south pole'];
      idsToRemove.forEach(id => {
        const region = svgElement.querySelector(`[id="${id}"], [id="${id.charAt(0).toUpperCase() + id.slice(1)}"], [id="${id.toUpperCase()}"]`);
        region?.remove();
      });

      const paths = svgElement.querySelectorAll('path');

      paths.forEach(path => {
        path.setAttribute('fill', '#FF4444');
        path.setAttribute('stroke', '#CCCCCC');
        path.setAttribute('stroke-width', '0.5');
        path.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
        path.style.transition = 'all 300ms ease';

        const countryId = path.getAttribute('id') || '';
        const isKnownCountry = this.isCountryInList(countryId);

        if (isKnownCountry) {
          path.classList.add('interactive-country');

          // Add pin emoji for interactive countries
          this.addPinToCountry(path, countryId);

          path.addEventListener('mouseenter', (event) => this.onCountryMouseEnter(event, countryId));
          path.addEventListener('mouseleave', (event) => this.onCountryMouseLeave(event, countryId));
          path.addEventListener('mousemove', (event) => this.onCountryMouseMove(event));
        }
      });
    }
  }

  addPinToCountry(path: SVGPathElement, countryId: string): void {
    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    if (!svgElement) return;

    // Get the bounding box of the country path
    const bbox = path.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    // Create pin group
    const pinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pinGroup.classList.add('country-pin');
    pinGroup.setAttribute('data-country', countryId);

    // Create pin emoji
    const pinText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    pinText.setAttribute('x', centerX.toString());
    pinText.setAttribute('y', centerY.toString());
    pinText.setAttribute('font-size', '16');
    pinText.setAttribute('fill', '#e74c3c');
    pinText.setAttribute('text-anchor', 'middle');
    pinText.setAttribute('dominant-baseline', 'middle');
    pinText.textContent = '📍';
    pinText.classList.add('pin');

    pinGroup.appendChild(pinText);
    svgElement.appendChild(pinGroup);

    // Add event listeners to the pin
    pinGroup.addEventListener('mouseenter', (event) => this.onCountryMouseEnter(event, countryId));
    pinGroup.addEventListener('mouseleave', (event) => this.onCountryMouseLeave(event, countryId));
    pinGroup.addEventListener('mousemove', (event) => this.onCountryMouseMove(event));
  }

  isCountryInList(countryId: string): boolean {
    countryId = countryId.toLowerCase();
    return Object.keys(this.countries).some(code =>
      countryId.includes(code)
    );
  }

  initializeCountryData(): void {
    this.countries = {
      'usa': {
        name: 'United States',
        capital: 'Washington, D.C.',
        population: '331 million',
        area: '9.83 million km²',
        continent: 'North America',
        description: 'A diverse nation known for its economic power, cultural influence, and technological innovation across the globe.'
      },
      'canada': {
        name: 'Canada',
        capital: 'Ottawa',
        population: '38 million',
        area: '9.98 million km²',
        continent: 'North America',
        description: 'The second-largest country by land area, famous for its natural beauty, multiculturalism, and high quality of life.'
      },
      'mexico': {
        name: 'Mexico',
        capital: 'Mexico City',
        population: '126 million',
        area: '1.96 million km²',
        continent: 'North America',
        description: 'A vibrant country rich in ancient civilizations, colorful culture, delicious cuisine, and stunning landscapes.'
      },
      'brazil': {
        name: 'Brazil',
        capital: 'Brasília',
        population: '213 million',
        area: '8.52 million km²',
        continent: 'South America',
        description: 'Home to the Amazon rainforest, beautiful beaches, passionate football culture, and the vibrant city of Rio de Janeiro.'
      },
      'russia': {
        name: 'Russia',
        capital: 'Moscow',
        population: '146 million',
        area: '17.1 million km²',
        continent: 'Europe/Asia',
        description: 'The largest country in the world, spanning eleven time zones with rich history, literature, and vast natural resources.'
      },
      'china': {
        name: 'China',
        capital: 'Beijing',
        population: '1.4 billion',
        area: '9.6 million km²',
        continent: 'Asia',
        description: 'An ancient civilization and modern superpower, known for the Great Wall, technological advancement, and diverse landscapes.'
      },
      'india': {
        name: 'India',
        capital: 'New Delhi',
        population: '1.38 billion',
        area: '3.29 million km²',
        continent: 'Asia',
        description: 'A land of incredible diversity with ancient traditions, spiritual heritage, spicy cuisine, and bustling modern cities.'
      },
      'australia': {
        name: 'Australia',
        capital: 'Canberra',
        population: '25.7 million',
        area: '7.69 million km²',
        continent: 'Oceania',
        description: 'A unique continent-country famous for its distinctive wildlife, beautiful beaches, and laid-back outdoor lifestyle.'
      },
      'germany': {
        name: 'Germany',
        capital: 'Berlin',
        population: '83 million',
        area: '357,022 km²',
        continent: 'Europe',
        description: 'A central European powerhouse known for engineering excellence, rich history, beautiful castles, and Oktoberfest.'
      },
      'france': {
        name: 'France',
        capital: 'Paris',
        population: '67 million',
        area: '643,801 km²',
        continent: 'Europe',
        description: 'The epitome of elegance with world-renowned cuisine, fashion, art, and iconic landmarks like the Eiffel Tower.'
      },
      'uk': {
        name: 'United Kingdom',
        capital: 'London',
        population: '67 million',
        area: '242,495 km²',
        continent: 'Europe',
        description: 'An island nation with a rich royal heritage, literary tradition, and influence on global culture and language.'
      },
      'japan': {
        name: 'Japan',
        capital: 'Tokyo',
        population: '126 million',
        area: '377,975 km²',
        continent: 'Asia',
        description: 'A fascinating blend of ancient traditions and cutting-edge technology, famous for sushi, anime, and cherry blossoms.'
      },
      'egypt': {
        name: 'Egypt',
        capital: 'Cairo',
        population: '102 million',
        area: '1.01 million km²',
        continent: 'Africa',
        description: 'Home to ancient pyramids, the Sphinx, and the Nile River, bridging Africa and the Middle East with rich history.'
      },
      'south_africa': {
        name: 'South Africa',
        capital: 'Pretoria, Cape Town, Bloemfontein',
        population: '59 million',
        area: '1.22 million km²',
        continent: 'Africa',
        description: 'Known as the Rainbow Nation for its diversity, stunning landscapes, wildlife safaris, and Nelson Mandela\'s legacy.'
      },
      'tunisia': {
        name: 'Tunisia',
        capital: 'Tunis',
        population: '12 million',
        area: '163,610 km²',
        continent: 'Africa',
        description: 'A North African gem with Mediterranean beaches, ancient Carthage ruins, and the birthplace of the Arab Spring.'
      },
      'italy': {
        name: 'Italy',
        capital: 'Rome',
        population: '60 million',
        area: '301,340 km²',
        continent: 'Europe',
        description: 'A boot-shaped peninsula famous for pasta, pizza, Renaissance art, Roman history, and stunning Mediterranean coastlines.'
      }
    };
  }

  onCountryMouseEnter(event: MouseEvent, countryId: string): void {
    const path = this.getCountryPath(countryId);
    if (!path) return;

    // Treat mouse enter as a click to lock the country selection
    this.isCountryLocked = true;
    this.lockedCountryPath = path;

    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    const container = document.querySelector('.world-map-container') as HTMLElement;

    // Add the country-selected class to the container
    if (container) {
      container.classList.add('country-selected');
    }

    // Make all countries blend with background except the selected one
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      p.classList.remove('selected');
      if (p !== path) {
        p.setAttribute('fill', '#FF4444');
        p.style.opacity = '0.8';
        p.style.filter = 'none';
        p.style.transform = 'none';
        p.style.zIndex = '0';
      }
    });

    // Highlight the selected country and its pin
    path.classList.add('selected');
    path.setAttribute('fill', '#FFFFFF');
    path.style.opacity = '1';
    path.setAttribute('transform', 'translate(0, -5px) scale(1.5)');
    path.style.filter = 'drop-shadow(8px 16px 20px rgba(255, 255, 255, 0.8))';
    path.style.zIndex = '5000';

    // Elevate the pin for the selected country
    const pinGroup = svgElement.querySelector(`.country-pin[data-country="${countryId}"]`) as SVGGElement;
    if (pinGroup) {
      pinGroup.style.zIndex = '5100';
      pinGroup.style.transform = 'scale(1.3)';
    }

    // Find and set the selected country
    for (const [id, country] of Object.entries(this.countries)) {
      if (countryId.toLowerCase().includes(id)) {
        this.selectedCountry = country;
        this.hoveredCountryId = countryId;
        this.showTooltip = true;

        // Emit the selected country to the parent
        this.countrySelected.emit(country);
        break;
      }
    }
  }

  onCountryMouseLeave(event: MouseEvent, countryId: string): void {
    // Don't reset if a country is locked
    if (this.isCountryLocked) return;

    const path = this.getCountryPath(countryId);
    if (!path) return;

    const svgElement = document.querySelector('#world-map svg') as SVGElement;

    // Reset all countries to blend with background
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      p.setAttribute('fill', '#FF4444');
      p.style.opacity = '0.8';
      p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
      p.style.transform = 'none';
      p.style.zIndex = '0';
    });

    // Reset the pin
    const pinGroup = svgElement.querySelector(`.country-pin[data-country="${countryId}"]`) as SVGGElement;
    if (pinGroup) {
      pinGroup.style.zIndex = '1000';
      pinGroup.style.transform = 'none';
    }

    // Reset the hovered country
    path.removeAttribute('transform');
    path.style.zIndex = '0';

    // Hide tooltip
    this.selectedCountry = null;
    this.hoveredCountryId = null;
    this.showTooltip = false;
  }

  getCountryPath(countryId: string): SVGPathElement | null {
    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    if (!svgElement) return null;

    // Try to find the path by ID
    let path = svgElement.querySelector(`path[id*="${countryId}"]`) as SVGPathElement;

    // If not found, try to find by class or other attributes
    if (!path) {
      const allPaths = svgElement.querySelectorAll('path');
      allPaths.forEach(p => {
        const pathId = p.getAttribute('id') || '';
        if (pathId.toLowerCase().includes(countryId.toLowerCase())) {
          path = p as SVGPathElement;
          return;
        }
      });
    }

    return path;
  }

  closeTooltip(): void {
    if (!this.isCountryLocked) return;

    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    const container = document.querySelector('.world-map-container') as HTMLElement;

    // Remove the country-selected class from the container
    if (container) {
      container.classList.remove('country-selected');
    }

    // Reset all countries to blend with background
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      p.classList.remove('selected');
      p.setAttribute('fill', '#FF4444');
      p.style.opacity = '0.8';
      p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
      p.style.transform = 'none';
      p.style.zIndex = '0';
    });

    // Reset all pins
    const pinGroups = svgElement.querySelectorAll('.country-pin');
    pinGroups.forEach((pin:any) => {
      pin.style.zIndex = '1000';
      pin.style.transform = 'none';
    });

    // Reset the locked country
    if (this.lockedCountryPath) {
      this.lockedCountryPath.removeAttribute('transform');
      this.lockedCountryPath.style.zIndex = '0';
      this.lockedCountryPath = null;
    }

    // Reset state
    this.isCountryLocked = false;
    this.selectedCountry = null;
    this.hoveredCountryId = null;
    this.showTooltip = false;
  }


    exploreMore(): void {
      if (this.selectedCountry) {
      this.router.navigate(['/country', this.selectedCountry.name]);
    }
    }


  onCountryMouseMove(event: MouseEvent): void {
    // Position tooltip with some offset to avoid cursor overlap
    this.tooltipX = event.clientX + 15;
    this.tooltipY = event.clientY - 10;

    // Ensure tooltip doesn't go off-screen
    const tooltipWidth = 450;
    const tooltipHeight = 250;

    if (this.tooltipX + tooltipWidth > window.innerWidth) {
      this.tooltipX = event.clientX - tooltipWidth - 15;
    }

    if (this.tooltipY + tooltipHeight > window.innerHeight) {
      this.tooltipY = event.clientY - tooltipHeight - 10;
    }

    if (this.tooltipY < 0) {
      this.tooltipY = event.clientY + 15;
    }
  }
}
