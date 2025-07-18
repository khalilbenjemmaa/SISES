import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMobileNavOpen = false;

  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
    document.body.classList.toggle('mobile-nav-active', this.isMobileNavOpen);
  }

  // Optional: Close menu on scroll or resize
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1200 && this.isMobileNavOpen) {
      this.closeMobileNav();
    }
  }

  private closeMobileNav() {
    this.isMobileNavOpen = false;
    document.body.classList.remove('mobile-nav-active');
  }
}
