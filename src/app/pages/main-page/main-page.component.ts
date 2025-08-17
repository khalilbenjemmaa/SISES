import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  title = 'SISES-APP';

  constructor(private renderer: Renderer2, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to router events to handle navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadScript();
      });

    // Load script initially
    this.loadScript();
  }

  private loadScript(): void {
    // Remove existing script if it exists
    const existingScript = document.querySelector('script[src="/assets/js/main.js"]');
    if (existingScript) {
      this.renderer.removeChild(document.body, existingScript);
    }

    // Append new script
    const script = this.renderer.createElement('script');
    script.src = '/assets/js/main.js';
    script.type = 'text/javascript';
    // Optional: Add a cache-busting query parameter to force reload
    script.src += `?v=${new Date().getTime()}`;
    this.renderer.appendChild(document.body, script);
  }
}
