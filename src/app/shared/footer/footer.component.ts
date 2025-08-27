import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  ngOnInit() {
    // Update the year in the DOM
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = this.currentYear.toString();
    }
  }

  onNewsletterSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;

    if (emailInput && emailInput.value) {
      // Show success message
      this.showNewsletterMessage('Merci pour votre inscription!', 'success');
      emailInput.value = '';
    } else {
      this.showNewsletterMessage('Veuillez entrer une adresse email valide.', 'error');
    }
  }

  private showNewsletterMessage(message: string, type: 'success' | 'error') {
    // Create a temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#d72027' : '#ff4757'};
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      z-index: 1000;
      white-space: nowrap;
      animation: slideInDown 0.3s ease-out;
    `;

    // Add to newsletter form
    const newsletterForm = document.querySelector('.newsletter-form') as HTMLElement;
    if (newsletterForm) {
      newsletterForm.style.position = 'relative';
      newsletterForm.appendChild(messageDiv);

      // Remove after 3 seconds
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 3000);
    }
  }
}
