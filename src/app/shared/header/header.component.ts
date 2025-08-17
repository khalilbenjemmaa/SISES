import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  isMobileNavOpen = false;

  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
    document.body.classList.toggle('mobile-nav-active', this.isMobileNavOpen);
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1200 && this.isMobileNavOpen) {
      this.closeMobileNav();
    }
  }

  closeMobileNav() {
    if (this.isMobileNavOpen) {
      this.isMobileNavOpen = false;
      document.body.classList.remove('mobile-nav-active');
    }
  }
}
