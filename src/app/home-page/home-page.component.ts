import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent  {

  modalImage: string = ''; // This will store the image URL to display in the modal

  constructor() {}

  // Method to open the modal and set the image source
  openModal(imageSrc: string) {
    this.modalImage = imageSrc;
    // Bootstrap modal show method
    const modalElement = document.getElementById('certificationModal');
    
  }
}
