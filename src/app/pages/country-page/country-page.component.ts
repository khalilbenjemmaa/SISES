import { Component, OnInit, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, ViewportScroller } from '@angular/common';
import { CountryDataService } from "../../country-data-service.service";
import { AnimationService } from '../../animation.service';

@Component({
  selector: 'app-page-pays',
  templateUrl: './country-page.component.html',
  styleUrls: ['./country-page.component.scss']
})
export class CountryPageComponent implements OnInit, AfterViewInit {
  nomPays: string | null = null;
  donneesPays: any;
  imageLoaded: boolean = false;
  contentVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private countryDataService: CountryDataService,
    private location: Location,
    private router: Router,
    private animationService: AnimationService,
    private renderer: Renderer2,
    private el: ElementRef,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    // Multiple approaches to ensure scroll to top
    this.scrollToTop();
    
    this.route.paramMap.subscribe(params => {
      this.nomPays = params.get('name');
      this.chargerDonneesPays();
    });

    // Only run transition if we have animation data
    if (this.animationService.cardRect && this.animationService.imageUrl) {
      this.runScrollFixedTransition();
    } else {
      this.contentVisible = true;
      const pageContent = this.el.nativeElement.querySelector('.country-page-content-wrapper');
      if (pageContent) {
        this.renderer.setStyle(pageContent, 'opacity', '1');
      }
    }
  }

  ngAfterViewInit(): void {
    // Additional scroll to top after view is initialized
    setTimeout(() => {
      this.scrollToTop();
    }, 0);
  }

  private scrollToTop(): void {
    // Use ViewportScroller (Angular's recommended approach)
    this.viewportScroller.scrollToPosition([0, 0]);
    
    // Fallback methods
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }

  runScrollFixedTransition() {
    const rect = this.animationService.cardRect;
    const imageUrl = this.animationService.imageUrl;

    if (!rect || !imageUrl) {
      this.contentVisible = true;
      return;
    }

    const transitionElement = this.renderer.createElement('div');
    this.renderer.setStyle(transitionElement, 'position', 'fixed');
    this.renderer.setStyle(transitionElement, 'top', `${rect.top}px`);
    this.renderer.setStyle(transitionElement, 'left', `${rect.left}px`);
    this.renderer.setStyle(transitionElement, 'width', `${rect.width}px`);
    this.renderer.setStyle(transitionElement, 'height', `${rect.height}px`);
    this.renderer.setStyle(transitionElement, 'backgroundImage', `url(${imageUrl})`);
    this.renderer.setStyle(transitionElement, 'backgroundSize', 'cover');
    this.renderer.setStyle(transitionElement, 'backgroundPosition', 'center');
    this.renderer.setStyle(transitionElement, 'zIndex', '10000');
    this.renderer.setStyle(transitionElement, 'transition', 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)');

    this.renderer.appendChild(document.body, transitionElement);
    this.renderer.addClass(document.body, 'no-scroll');

    requestAnimationFrame(() => {
      this.renderer.setStyle(transitionElement, 'top', '0');
      this.renderer.setStyle(transitionElement, 'left', '0');
      this.renderer.setStyle(transitionElement, 'width', '100vw');
      this.renderer.setStyle(transitionElement, 'height', '100vh');
    });

    setTimeout(() => {
      this.contentVisible = true;
      
      setTimeout(() => {
        const pageContent = this.el.nativeElement.querySelector('.country-page-content-wrapper');
        if (pageContent) {
          this.renderer.setStyle(pageContent, 'opacity', '1');
          this.renderer.setStyle(pageContent, 'transition', 'opacity 0.3s ease-in-out');
        }
        // Ensure we're still at the top after animation
        this.scrollToTop();
      }, 0);

    }, 500);

    setTimeout(() => {
        this.renderer.removeChild(document.body, transitionElement);
        this.renderer.removeClass(document.body, 'no-scroll');
        this.animationService.cardRect = null;
        this.animationService.imageUrl = null;
        // Final scroll to top after cleanup
        this.scrollToTop();
    }, 600);
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

