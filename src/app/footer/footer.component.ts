import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  badgeVisible = false;

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll')
  onScroll(): void {
    const footer = this.el.nativeElement as HTMLElement;
    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      this.badgeVisible = true;
    }
  }
}
