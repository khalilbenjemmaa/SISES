import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

interface Country {
  name: string;
  capital: string;
  population: string;
  area: string;
  continent: string;
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

          path.addEventListener('mouseenter', (event) => this.onCountryMouseEnter(event, countryId));
          path.addEventListener('mouseleave', (event) => this.onCountryMouseLeave(event, countryId));
          path.addEventListener('mousemove', (event) => this.onCountryMouseMove(event));
        }
      });
    }
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
        continent: 'North America'
      },
      'canada': {
        name: 'Canada',
        capital: 'Ottawa',
        population: '38 million',
        area: '9.98 million km²',
        continent: 'North America'
      },
      'mexico': {
        name: 'Mexico',
        capital: 'Mexico City',
        population: '126 million',
        area: '1.96 million km²',
        continent: 'North America'
      },
      'brazil': {
        name: 'Brazil',
        capital: 'Brasília',
        population: '213 million',
        area: '8.52 million km²',
        continent: 'South America'
      },
      'russia': {
        name: 'Russia',
        capital: 'Moscow',
        population: '146 million',
        area: '17.1 million km²',
        continent: 'Europe/Asia'
      },
      'china': {
        name: 'China',
        capital: 'Beijing',
        population: '1.4 billion',
        area: '9.6 million km²',
        continent: 'Asia'
      },
      'india': {
        name: 'India',
        capital: 'New Delhi',
        population: '1.38 billion',
        area: '3.29 million km²',
        continent: 'Asia'
      },
      'australia': {
        name: 'Australia',
        capital: 'Canberra',
        population: '25.7 million',
        area: '7.69 million km²',
        continent: 'Oceania'
      },
      'germany': {
        name: 'Germany',
        capital: 'Berlin',
        population: '83 million',
        area: '357,022 km²',
        continent: 'Europe'
      },
      'france': {
        name: 'France',
        capital: 'Paris',
        population: '67 million',
        area: '643,801 km²',
        continent: 'Europe'
      },
      'uk': {
        name: 'United Kingdom',
        capital: 'London',
        population: '67 million',
        area: '242,495 km²',
        continent: 'Europe'
      },
      'japan': {
        name: 'Japan',
        capital: 'Tokyo',
        population: '126 million',
        area: '377,975 km²',
        continent: 'Asia'
      },
      'egypt': {
        name: 'Egypt',
        capital: 'Cairo',
        population: '102 million',
        area: '1.01 million km²',
        continent: 'Africa'
      },
      'south_africa': {
        name: 'South Africa',
        capital: 'Pretoria, Cape Town, Bloemfontein',
        population: '59 million',
        area: '1.22 million km²',
        continent: 'Africa'
      },
      'tunisia': {
        name: 'Tunisia',
        capital: 'Tunis',
        population: '12 million',
        area: '163,610 km²',
        continent: 'Africa'
      },
      'italy': {
        name: 'Italy',
        capital: 'Rome',
        population: '60 million',
        area: '301,340 km²',
        continent: 'Europe'
      }
    };
  }

  onCountryMouseEnter(event: MouseEvent, countryId: string): void {
    const path = event.target as SVGPathElement;

    path.setAttribute('fill', '#FFFFFF');
    path.setAttribute('transform', 'translate(0, -2) scale(1.1)');
    path.style.filter = 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))';
    path.style.zIndex = '100';
    path.style.opacity = '1';

    const paths = document.querySelectorAll('path');
    paths.forEach(p => {
      if (p !== path) {
        p.setAttribute('fill', '#FF0000');
        p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
      }
    });

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
    const path = event.target as SVGPathElement;

    path.setAttribute('fill', '#FFFFFF');
    path.removeAttribute('transform');
    path.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
    path.style.zIndex = '1';

    const paths = document.querySelectorAll('path');
    paths.forEach(p => {
      if (p !== path) {
        p.setAttribute('fill', '#FFFFFF');
        p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
      }
    });

    this.selectedCountry = null;
    this.hoveredCountryId = null;
    this.showTooltip = false;
  }

  onCountryMouseMove(event: MouseEvent): void {
    this.tooltipX = event.clientX + 10;
    this.tooltipY = event.clientY + 10;
  }
}
