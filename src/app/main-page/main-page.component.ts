import {Component, Renderer2} from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  title = 'SISES-APP';
  constructor(private renderer : Renderer2) { }
  ngAfterViewInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'assets/js/main.js';
    script.type = 'text/javascript';
    this.renderer.appendChild(document.body, script);
  }
}
