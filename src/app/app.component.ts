  styleUrls: ['./app.component.scss']
import { Component, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'SISES-APP';

  constructor(private renderer: Renderer2) {}

  // This listener watches for the user scrolling the page
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 100) {
      this.renderer.addClass(document.body, 'scrolled');
    } else {
      this.renderer.removeClass(document.body, 'scrolled');
    }
  }

  ngAfterViewInit(): void {
    // Initialize AOS after the view is ready
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
}
