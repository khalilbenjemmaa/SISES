import { AfterViewInit, Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'SISES-APP';
  constructor(private renderer : Renderer2) { }
  ngAfterViewInit(): void {
   const script = this.renderer.createElement('script');
   script.src = 'assets/js/main.js';
   script.type = 'text/javascript';
   this.renderer.appendChild(document.body, script);
  }
}
