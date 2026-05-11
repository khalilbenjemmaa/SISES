import { Component, HostListener, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit {
  badgeVisible = false;

  private icefScriptSrc = 'https://www-cdn.icef.com/scripts/iasbadgeid.js';

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // ensure visibility check runs on init
    this.onScroll();
    this.loadIcefScript();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const footer = this.el.nativeElement as HTMLElement;
    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      this.badgeVisible = true;
    }
  }

  private loadIcefScript(): void {
    if (typeof document === 'undefined') return;

    // Avoid loading the script multiple times
    const existing = document.querySelector(`script[src="${this.icefScriptSrc}"]`);
    if (existing) {
      // If script is already present, try re-executing by creating a fresh script element
      const s = document.createElement('script');
      s.async = true;
      s.defer = true;
      s.crossOrigin = 'anonymous';
      s.src = this.icefScriptSrc;
      document.body.appendChild(s);
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = this.icefScriptSrc;
    document.body.appendChild(script);
  }
}
