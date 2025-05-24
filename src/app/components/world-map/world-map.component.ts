import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

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

  constructor(private http: HttpClient) { }

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
        path.setAttribute('fill', '#FFFFFF');
        path.setAttribute('stroke', '#CCCCCC');
        path.setAttribute('stroke-width', '0.5');
        path.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
        path.style.transition = 'all 300ms ease';

        const countryId = path.getAttribute('id') || '';
        const isKnownCountry = this.isCountryInList(countryId);

        if (isKnownCountry) {
          path.classList.add('interactive-country');

          // Add pin for interactive countries
          this.addPinToCountry(path, countryId);

          path.addEventListener('mouseenter', (event) => this.onCountryMouseEnter(event, countryId));
          path.addEventListener('mouseleave', (event) => this.onCountryMouseLeave(event, countryId));
          path.addEventListener('mousemove', (event) => this.onCountryMouseMove(event));
          path.addEventListener('click', (event) => this.onCountryClick(event, countryId));
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

    // Create pin circle
    const pinCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pinCircle.setAttribute('cx', centerX.toString());
    pinCircle.setAttribute('cy', centerY.toString());
    pinCircle.setAttribute('r', '4');
    pinCircle.setAttribute('fill', '#e74c3c');
    pinCircle.setAttribute('stroke', '#ffffff');
    pinCircle.setAttribute('stroke-width', '2');
    pinCircle.classList.add('pin');

    // Create pin pulse effect
    const pinPulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    pinPulse.setAttribute('cx', centerX.toString());
    pinPulse.setAttribute('cy', centerY.toString());
    pinPulse.setAttribute('r', '4');
    pinPulse.setAttribute('fill', 'none');
    pinPulse.setAttribute('stroke', '#e74c3c');
    pinPulse.setAttribute('stroke-width', '2');
    pinPulse.setAttribute('opacity', '0.7');
    pinPulse.classList.add('pin-pulse');

    pinGroup.appendChild(pinPulse);
    pinGroup.appendChild(pinCircle);
    svgElement.appendChild(pinGroup);

    // Add event listeners to the pin
    pinGroup.addEventListener('mouseenter', (event) => this.onCountryMouseEnter(event, countryId));
    pinGroup.addEventListener('mouseleave', (event) => this.onCountryMouseLeave(event, countryId));
    pinGroup.addEventListener('mousemove', (event) => this.onCountryMouseMove(event));
    pinGroup.addEventListener('click', (event) => this.onCountryClick(event, countryId));
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
    // Don't change anything if a country is already locked
    if (this.isCountryLocked) return;

    const path = this.getCountryPath(countryId);
    if (!path) return;

    const svgElement = document.querySelector('#world-map svg') as SVGElement;

    // Make all countries red except the hovered one
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      if (p !== path) {
        p.setAttribute('fill', '#FF4444');
        p.style.opacity = '0.8';
        p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1))';
      }
    });

    // Keep the hovered country white and highlighted
    path.setAttribute('fill', '#FFFFFF');
    path.style.opacity = '1';
    path.setAttribute('transform', 'translate(0, -2) scale(1.1)');
    path.style.filter = 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))';
    path.style.zIndex = '100';

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

    // Reset all countries to white
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      p.setAttribute('fill', '#FFFFFF');
      p.style.opacity = '1';
      p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
    });

    // Reset the hovered country
    path.removeAttribute('transform');
    path.style.zIndex = '1';

    // Hide tooltip
    this.selectedCountry = null;
    this.hoveredCountryId = null;
    this.showTooltip = false;
  }

  onCountryClick(event: MouseEvent, countryId: string): void {
    const path = this.getCountryPath(countryId);
    if (!path) return;

    // Lock the country selection
    this.isCountryLocked = true;
    this.lockedCountryPath = path;

    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    const container = document.querySelector('.world-map-container') as HTMLElement;

    // Change container background to red
    if (container) {
      container.style.backgroundColor = '#FF4444';
    }

    // Change SVG background to red
    if (svgElement) {
      svgElement.style.backgroundColor = '#FF4444';
    }

    // Make all countries red except the selected one
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      if (p !== path) {
        p.setAttribute('fill', '#FF4444');
        p.style.opacity = '1';
        p.style.filter = 'none';
      }
    });

    // Keep the selected country white and highlighted
    path.setAttribute('fill', '#FFFFFF');
    path.style.opacity = '1';
    path.setAttribute('transform', 'translate(0, -2) scale(1.2)');
    path.style.filter = 'drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.4))';
    path.style.zIndex = '1000';

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

    // Reset container background to white
    if (container) {
      container.style.backgroundColor = '#ffffff';
    }

    // Reset SVG background to original
    if (svgElement) {
      svgElement.style.backgroundColor = '#e6f3ff';
    }

    // Reset all countries to white
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      p.setAttribute('fill', '#FFFFFF');
      p.style.opacity = '1';
      p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
    });

    // Reset the locked country
    if (this.lockedCountryPath) {
      this.lockedCountryPath.removeAttribute('transform');
      this.lockedCountryPath.style.zIndex = '1';
      this.lockedCountryPath = null;
    }

    // Reset state
    this.isCountryLocked = false;
    this.selectedCountry = null;
    this.hoveredCountryId = null;
    this.showTooltip = false;
  }

  onCountryMouseMove(event: MouseEvent): void {
    // Position tooltip with some offset to avoid cursor overlap
    this.tooltipX = event.clientX + 15;
    this.tooltipY = event.clientY - 10;

    // Ensure tooltip doesn't go off-screen
    const tooltipWidth = 450; // Increased width for larger tooltip
    const tooltipHeight = 250; // Increased height for larger tooltip

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
