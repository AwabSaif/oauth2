import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="public-test-container">
      <h2>Public Test Component</h2>
      <p>This is a public component that does not require authentication.</p>
      <p>You can use this component to test routing and ensure your application is working correctly without OIDC.</p>
    </div>
  `,
  styles: [`
    .public-test-container {
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #f9f9f9;
      margin-top: 20px;
    }
    h2 {
      color: #333;
    }
    p {
      color: #555;
    }
  `]
})
export class PublicTestComponent {

}
