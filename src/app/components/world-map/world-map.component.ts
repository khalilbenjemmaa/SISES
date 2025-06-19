import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

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

  searchQuery: string = '';
  filteredCountries: { key: string, value: Country }[] = [];
  isDropdownOpen: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg',
      { responseType: 'text' })
      .subscribe(data => {
        this.svgContent = data;
        setTimeout(() => this.initializeMap(), 100);
      });

    this.initializeCountryData();
    this.filterCountries(); // Initialize filtered countries
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
        path.setAttribute('fill', '#e14e5e');
        path.setAttribute('stroke', '#CCCCCC');
        path.setAttribute('stroke-width', '0.5');
        path.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
        path.style.transition = 'all 300ms ease';

        const countryId = path.getAttribute('id') || '';
        const isKnownCountry = this.isCountryInList(countryId);

        if (isKnownCountry) {
          path.classList.add('interactive-country');
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

    const bbox = path.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    const pinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pinGroup.classList.add('country-pin');
    pinGroup.setAttribute('data-country', countryId);

    const pinText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    pinText.setAttribute('x', centerX.toString());
    pinText.setAttribute('y', centerY.toString());
    pinText.setAttribute('font-size', '16');
    pinText.setAttribute('fill', '#e14e5e');
    pinText.setAttribute('text-anchor', 'middle');
    pinText.setAttribute('dominant-baseline', 'middle');
    pinText.textContent = '📍';
    pinText.classList.add('pin');

    pinGroup.appendChild(pinText);
    svgElement.appendChild(pinGroup);

    pinGroup.addEventListener('mouseenter', (event) => this.onCountryMouseEnter(event, countryId));
    pinGroup.addEventListener('mouseleave', (event) => this.onCountryMouseLeave(event, countryId));
    pinGroup.addEventListener('mousemove', (event) => this.onCountryMouseMove(event));
  }

  isCountryInList(countryId: string): boolean {
    countryId = countryId.toLowerCase();
    return Object.keys(this.countries).some(code =>
      countryId.includes(code.toLowerCase())
    );
  }

  initializeCountryData(): void {
    this.countries = {
      'Germany': {
        name: 'ALLEMAGNE',
        capital: 'Berlin',
        population: '83 million',
        area: '357,022 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Allemagne : Explorez des programmes en ingénierie, technologie, et sciences avec des universités de renommée mondiale comme le Technische Universität München, offrant une expérience unique dans un pays riche en histoire et culture.'
      },
      'italy': {
        name: 'ITALIE',
        capital: 'Rome',
        population: '60 million',
        area: '301,340 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Italie : Découvrez des programmes en italien (B2) ou en anglais (B2) tels que licence, master, médecine, ou ingénierie, dans des villes historiques comme Rome, Florence, et Milan, mêlant éducation et patrimoine culturel.'
      },
      'belgium': {
        name: 'BELGIQUE',
        capital: 'Brussels',
        population: '11.5 million',
        area: '30,548 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Belgique : Profitez de programmes multilingues en français, néerlandais ou anglais dans des institutions comme l’Université de Louvain, avec un accès facile aux centres européens à Bruxelles.'
      },
      'bosnia': {
        name: 'BOSNIE',
        capital: 'Sarajevo',
        population: '3.3 million',
        area: '51,129 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Bosnie : Découvrez des opportunités d’études abordables en anglais ou bosniaque, avec une riche histoire multiculturelle et des universités comme l’Université de Sarajevo.'
      },
      'canada': {
        name: 'CANADA',
        capital: 'Ottawa',
        population: '38 million',
        area: '9,984,670 km²',
        continent: 'North America',
        description: 'Études à l’étranger au Canada : Rejoignez des universités mondialement reconnues comme l’Université de Toronto pour des programmes en anglais ou français, dans un environnement multiculturel et naturel.'
      },
      'south korea': {
        name: 'COREE DU SUD',
        capital: 'Seoul',
        population: '51 million',
        area: '100,410 km²',
        continent: 'Asia',
        description: 'Études à l’étranger en Corée du Sud : Explorez des programmes en technologie, K-pop, et cinéma à des universités comme Yonsei, dans une culture dynamique et moderne.'
      },
      'dubai': {
        name: 'DUBAI',
        capital: 'Dubai',
        population: '3.5 million',
        area: '4,114 km²',
        continent: 'Asia',
        description: 'Études à l’étranger à Dubaï : Intégrez des programmes internationaux en affaires, ingénierie, et design dans des institutions comme l’Université de Dubaï, au cœur d’une métropole futuriste.'
      },
      'spain': {
        name: 'ESPAGNE',
        capital: 'Madrid',
        population: '47 million',
        area: '505,990 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Espagne : Apprenez l’espagnol et suivez des programmes en arts, affaires ou médecine dans des villes comme Barcelone ou Madrid, riches en culture et histoire.'
      },
      'france': {
        name: 'FRANCE',
        capital: 'Paris',
        population: '67 million',
        area: '643,801 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en France : Profitez de l’excellence académique avec des universités comme la Sorbonne pour des études en français ou anglais, dans un cadre culturel prestigieux.'
      },
      'lithuania': {
        name: 'LITHUANIE',
        capital: 'Vilnius',
        population: '2.8 million',
        area: '65,300 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Lituanie : Découvrez des programmes abordables en anglais dans des universités comme l’Université de Vilnius, au cœur de l’Europe baltique.'
      },
      'malaysia': {
        name: 'MALAISIE',
        capital: 'Kuala Lumpur',
        population: '32 million',
        area: '330,803 km²',
        continent: 'Asia',
        description: 'Études à l’étranger en Malaisie : Intégrez des programmes en anglais ou malais dans des institutions comme l’Université de Malaya, dans un pays multiculturel et économique en croissance.'
      },
      'malta': {
        name: 'MALTE',
        capital: 'Valletta',
        population: '0.5 million',
        area: '316 km²',
        continent: 'Europe',
        description: 'Études à l’étranger à Malte : Suivez des cours en anglais dans un cadre méditerranéen, avec des programmes en langue, tourisme, et technologie à l’Université de Malte.'
      },
      'moldova': {
        name: 'MOLDAVIE',
        capital: 'Chisinau',
        population: '2.6 million',
        area: '33,846 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Moldavie : Explorez des études abordables en médecine et agriculture à l’Université d’État de Moldavie, dans un pays en développement.'
      },
      'netherlands': {
        name: 'PAYS BAS',
        capital: 'Amsterdam',
        population: '17 million',
        area: '41,543 km²',
        continent: 'Europe',
        description: 'Études à l’étranger aux Pays-Bas : Rejoignez des programmes en anglais à des universités comme l’Université d’Amsterdam, reconnues pour l’innovation et la durabilité.'
      },
      'portugal': {
        name: 'PORTUGAL',
        capital: 'Lisbon',
        population: '10.3 million',
        area: '92,090 km²',
        continent: 'Europe',
        description: 'Études à l’étranger au Portugal : Découvrez des programmes en portugais ou anglais à l’Université de Lisbonne, dans un pays connu pour son climat et sa culture.'
      },
      'romania': {
        name: 'ROUMANIE',
        capital: 'Bucharest',
        population: '19 million',
        area: '238,397 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Roumanie : Explorez des programmes abordables en médecine et ingénierie à l’Université de Bucarest, dans un pays riche en patrimoine.'
      },
      'united-kingdom': { // Changed from 'uk'
        name: 'ROYAUME-UNI',
        capital: 'London',
        population: '67 million',
        area: '243,610 km²',
        continent: 'Europe',
        description: 'Études à l’étranger au Royaume-Uni : Rejoignez des universités prestigieuses comme Oxford pour des programmes en anglais, dans un cadre historique et diversifié.'
      },
      'czech-republic': { // Changed from 'czech republic'
        name: 'REPUBLIQUE TCHEQUE',
        capital: 'Prague',
        population: '10.7 million',
        area: '78,865 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en République Tchèque : Intégrez des programmes en histoire, arts, et sciences à l’Université Charles, dans la magnifique ville de Prague.'
      },
      'serbia': {
        name: 'SERBIE',
        capital: 'Belgrade',
        population: '6.9 million',
        area: '88,361 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Serbie : Découvrez des programmes en sciences et arts à l’Université de Belgrade, dans un pays aux influences culturelles riches.'
      },
      'switzerland': {
        name: 'SUISSE',
        capital: 'Bern',
        population: '8.7 million',
        area: '41,285 km²',
        continent: 'Europe',
        description: 'Études à l’étranger en Suisse : Intégrez des programmes en finance, technologie, et sciences à l’EPFL, dans un pays connu pour sa neutralité et ses Alpes.'
      },
      'turkey': {
        name: 'TURQUIE',
        capital: 'Ankara',
        population: '85 million',
        area: '783,562 km²',
        continent: 'Asia',
        description: 'Études à l’étranger en Turquie : Explorez des programmes en médecine, ingénierie, et tourisme à l’Université d’Istanbul, au carrefour de l’Europe et de l’Asie.'
      },
      'usa': {
        name: 'USA',
        capital: 'Washington, D.C.',
        population: '331 million',
        area: '9,833,520 km²',
        continent: 'North America',
        description: 'Études à l’étranger aux États-Unis : Rejoignez des universités comme Harvard pour des programmes variés en anglais, dans un environnement diversifié et innovant.'
      }
    };
  }

  onCountryMouseEnter(event: MouseEvent, countryId: string): void {
    const path = this.getCountryPath(countryId);
    if (!path) return;

    this.isCountryLocked = true;
    this.lockedCountryPath = path;

    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    const container = document.querySelector('.world-map-container') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    const scrollTop=document.querySelector('#scroll-top') as HTMLElement;
    body.style.overflowY = 'hidden';
    scrollTop.style.opacity = '0';
    if (container) {
      container.classList.add('country-selected');
    }

    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      p.classList.remove('selected');
      if (p !== path) {
        p.setAttribute('fill', '#e14e5e');
        p.style.opacity = '0.8';
        p.style.filter = 'none';
        p.style.transform = 'none';
        p.style.zIndex = '0';
      }
    });

    path.classList.add('selected');
    path.setAttribute('fill', '#FFFFFF');
    path.style.opacity = '1';
    path.setAttribute('transform', 'translate(0, -5px) scale(1.5)');
    path.style.filter = 'drop-shadow(8px 16px 20px rgba(255, 255, 255, 0.8))';
    path.style.zIndex = '5000';

    const pinGroup = svgElement.querySelector(`.country-pin[data-country="${countryId}"]`) as SVGGElement;
    if (pinGroup) {
      pinGroup.style.zIndex = '5100';
      pinGroup.style.transform = 'scale(1.3)';
    }

    for (const [id, country] of Object.entries(this.countries)) {
      if (countryId.toLowerCase().includes(id.toLowerCase())) {
        this.selectedCountry = country;
        this.hoveredCountryId = countryId;
        this.showTooltip = true;
        this.countrySelected.emit(country);
        break;
      }
    }

    this.onCountryMouseMove(event);
  }

  onCountryMouseLeave(event: MouseEvent, countryId: string): void {
    if (this.isCountryLocked) return;

    const path = this.getCountryPath(countryId);
    if (!path) return;

    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    const body = document.querySelector('body') as HTMLElement;
    const scrollTop=document.querySelector('#scroll-top') as HTMLElement;
    body.style.overflowY = 'auto';
    scrollTop.style.opacity = '1';
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      p.setAttribute('fill', '#e14e5e');
      p.style.opacity = '0.8';
      p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
      p.style.transform = 'none';
      p.style.zIndex = '0';
    });

    const pinGroup = svgElement.querySelector(`.country-pin[data-country="${countryId}"]`) as SVGGElement;
    if (pinGroup) {
      pinGroup.style.zIndex = '1000';
      pinGroup.style.transform = 'none';
    }

    path.removeAttribute('transform');
    path.style.zIndex = '0';

    this.selectedCountry = null;
    this.hoveredCountryId = null;
    this.showTooltip = false;
  }

  getCountryPath(countryId: string): SVGPathElement | null {
    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    if (!svgElement) return null;

    let path = svgElement.querySelector(`path[id*="${countryId}"]`) as SVGPathElement;

    if (!path) {
      const allPaths = svgElement.querySelectorAll('path');
      for (const p of Array.from(allPaths)) {
        const pathId = p.getAttribute('id') || '';
        if (pathId.toLowerCase().includes(countryId.toLowerCase())) {
          path = p as SVGPathElement;
          break;
        }
      }
    }

    return path;
  }

  closeTooltip(): void {
    if (!this.isCountryLocked) return;

    const svgElement = document.querySelector('#world-map svg') as SVGElement;
    const container = document.querySelector('.world-map-container') as HTMLElement;
    const body = document.querySelector('body') as HTMLElement;
    const scrollTop=document.querySelector('#scroll-top') as HTMLElement;
    body.style.overflowY = 'auto';
    scrollTop.style.opacity = '1';

    if (container) {
      container.classList.remove('country-selected');
    }

    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(p => {
      p.classList.remove('selected');
      p.setAttribute('fill', '#e14e5e');
      p.style.opacity = '0.8';
      p.style.filter = 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.15))';
      p.style.transform = 'none';
      p.style.zIndex = '0';
    });

    const pinGroups = svgElement.querySelectorAll('.country-pin');
    pinGroups.forEach((pin: any) => {
      pin.style.zIndex = '1000';
      pin.style.transform = 'none';
    });

    if (this.lockedCountryPath) {
      this.lockedCountryPath.removeAttribute('transform');
      this.lockedCountryPath.style.zIndex = '0';
      this.lockedCountryPath = null;
    }

    this.isCountryLocked = false;
    this.selectedCountry = null;
    this.hoveredCountryId = null;
    this.showTooltip = false;
    this.clearSearch(); // Clear search when closing tooltip
  }

  exploreMore(): void {
    const body = document.querySelector('body') as HTMLElement;
    body.style.overflowY = 'auto';
    if (this.selectedCountry) {
      this.router.navigate(['/country', this.selectedCountry.name]);
    }
  }

  onCountryMouseMove(event: MouseEvent): void {
    if (!this.hoveredCountryId) return;

    const path = this.getCountryPath(this.hoveredCountryId);
    if (!path) return;

    const svgElement = document.querySelector('#world-map svg') as SVGSVGElement;
    if (!svgElement) return;

    const bbox = path.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    const matrix = path.getScreenCTM();
    if (!matrix) return;

    const point = svgElement.createSVGPoint();
    point.x = centerX;
    point.y = centerY;
    const screenPoint = point.matrixTransform(matrix);

    const tooltipWidth = 700;
    const tooltipHeight = 200;
    const offset = 15;

    // Position tooltip to the left of the country
    this.tooltipX = screenPoint.x - tooltipWidth - offset;
    this.tooltipY = screenPoint.y - tooltipHeight / 2;

    // Adjust if tooltip goes off-screen
    if (this.tooltipX < 0) {
      this.tooltipX = screenPoint.x + offset; // Fallback to right if left is not possible
    }

    if (this.tooltipY + tooltipHeight > window.innerHeight) {
      this.tooltipY = window.innerHeight - tooltipHeight - offset;
    }

    if (this.tooltipY < 0) {
      this.tooltipY = offset;
    }
  }

  onCountrySelect(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterCountries();
    this.isDropdownOpen = this.searchQuery.length > 0 && this.filteredCountries.length > 0;
  }

  filterCountries(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCountries = Object.entries(this.countries)
      .filter(([_, country]) => country.name.toLowerCase().includes(query))
      .map(([key, value]) => ({ key, value }));
  }

  selectCountry(key: string): void {
    this.searchCountry(key);
    this.searchQuery = this.countries[key].name;
    this.isDropdownOpen = false;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isDropdownOpen = false;
    this.filterCountries();
  }

  searchCountry(countryId: string): void {
    if (!countryId) return;

    const normalizedCountryId = countryId.toLowerCase();
    const path = this.getCountryPath(normalizedCountryId);
    if (!path) return;

    const svgElement = document.querySelector('#world-map svg') as SVGSVGElement;
    if (!svgElement) return;

    const bbox = path.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    const matrix = path.getScreenCTM();
    if (!matrix) return;

    const point = svgElement.createSVGPoint();
    point.x = centerX;
    point.y = centerY;
    const screenPoint = point.matrixTransform(matrix);

    const mouseEvent = new MouseEvent('mousemove', {
      clientX: screenPoint.x,
      clientY: screenPoint.y,
      bubbles: true
    });

    this.onCountryMouseEnter(mouseEvent, normalizedCountryId);
  }
}
