import { Component, ChangeDetectionStrategy, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMobileNavOpen = false;
  isScrolled = false;
  private scrollThreshold = 100;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkScrollPosition();
  }

  ngOnDestroy() {
    // Clean up if needed
  }

  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
    document.body.classList.toggle('mobile-nav-active', this.isMobileNavOpen);

    // Add smooth transition effects
    const navmenu = document.querySelector('.navmenu');
    if (navmenu) {
      if (this.isMobileNavOpen) {
        navmenu.classList.add('mobile-nav-active');
      } else {
        navmenu.classList.remove('mobile-nav-active');
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1200 && this.isMobileNavOpen) {
      this.closeMobileNav();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.checkScrollPosition();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navmenu = document.querySelector('.navmenu');

    // Close mobile nav when clicking outside
    if (this.isMobileNavOpen &&
        !mobileNavToggle?.contains(target) &&
        !navmenu?.contains(target)) {
      this.closeMobileNav();
    }
  }

  private checkScrollPosition() {
    const currentScrolled = window.pageYOffset > this.scrollThreshold;

    if (currentScrolled !== this.isScrolled) {
      this.isScrolled = currentScrolled;

      // Add/remove scrolled class to header
      const header = document.querySelector('.header');
      if (header) {
        header.classList.toggle('scrolled', this.isScrolled);
      }

      this.cdr.markForCheck();
    }
  }

  closeMobileNav() {
    if (this.isMobileNavOpen) {
      this.isMobileNavOpen = false;
      document.body.classList.remove('mobile-nav-active');

      const navmenu = document.querySelector('.navmenu');
      if (navmenu) {
        navmenu.classList.remove('mobile-nav-active');
      }
    }
  }

  // Smooth scroll to sections
  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();

    const element = document.querySelector(sectionId);
    if (element) {
      const headerHeight = document.querySelector('.header')?.clientHeight || 0;
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Close mobile nav after clicking
      if (this.isMobileNavOpen) {
        setTimeout(() => this.closeMobileNav(), 300);
      }
    }
  }

  // Add active class to current section link
  updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionElement = section as HTMLElement;
      const sectionTop = sectionElement.offsetTop;
      const sectionHeight = sectionElement.offsetHeight;
      const sectionId = sectionElement.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all links
        document.querySelectorAll('.navmenu a').forEach(link => {
          link.classList.remove('active');
        });

        // Add active class to current section link
        const activeLink = document.querySelector(`.navmenu a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScrollForActiveSection() {
    this.updateActiveSection();
  }
}
