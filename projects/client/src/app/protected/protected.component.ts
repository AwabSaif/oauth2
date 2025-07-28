import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="protected-container">
      <h2>Protected Page</h2>
      
      <div class="success-message">
        <h3>🎉 Success!</h3>
        <p>You have successfully accessed this protected route. This means you are authenticated!</p>
      </div>

      <div class="info-card">
        <h3>Your Authentication Details</h3>
        <div class="auth-details">
          <div class="detail-row">
            <span class="label">User Name:</span>
            <span class="value">{{ getUserName() }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">{{ getUserEmail() }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Subject ID:</span>
            <span class="value">{{ getUserSubject() }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Token Valid:</span>
            <span class="value" [class.valid]="authService.hasValidToken()">
              {{ authService.hasValidToken() ? 'Yes' : 'No' }}
            </span>
          </div>
        </div>
      </div>

      <div class="info-card">
        <h3>API Test</h3>
        <p>Test making authenticated API calls:</p>
        <button (click)="makeApiCall()" class="btn btn-primary" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Test API Call' }}
        </button>
        
        <div *ngIf="apiResult" class="api-result">
          <h4>API Response:</h4>
          <pre>{{ apiResult | json }}</pre>
        </div>
        
        <div *ngIf="apiError" class="api-error">
          <h4>API Error:</h4>
          <pre>{{ apiError }}</pre>
        </div>
      </div>

      <div class="info-card">
        <h3>Full Identity Claims</h3>
        <pre class="claims-json">{{ getIdentityClaims() | json }}</pre>
      </div>

      <div class="actions">
        <button (click)="refreshToken()" class="btn btn-secondary">Refresh Token</button>
        <button (click)="logout()" class="btn btn-danger">Logout</button>
      </div>
    </div>
  `,
  styles: [`
    .protected-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .success-message {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 2rem;
    }

    .success-message h3 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .info-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .info-card h3 {
      margin-top: 0;
      color: #495057;
    }

    .auth-details {
      display: grid;
      gap: 0.75rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e9ecef;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #495057;
    }

    .value {
      color: #6c757d;
      font-family: monospace;
    }

    .value.valid {
      color: #28a745;
      font-weight: 600;
    }

    .claims-json {
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 1rem;
      font-size: 0.875rem;
      overflow-x: auto;
      max-height: 300px;
      overflow-y: auto;
    }

    .api-result {
      margin-top: 1rem;
      padding: 1rem;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
    }

    .api-result pre {
      margin: 0;
      font-size: 0.875rem;
    }

    .api-error {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }

    .api-error pre {
      margin: 0;
      font-size: 0.875rem;
      color: #721c24;
    }

    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }
  `]
})
export class ProtectedComponent implements OnInit {
  loading = false;
  apiResult: any = null;
  apiError: string | null = null;

  constructor(
    public authService: AuthService,
    private http: HttpClient
  ) { 
    effect(() => {
      console.log('Protected component initialized - user is authenticated:', this.authService.isAuthenticated);
       this.getTokenRemainingTime()
    });
  }

  ngOnInit(): void {
    console.log('Protected component loaded - user is authenticated!');
   
  }

  getUserName(): string {
    const claims = this.authService.identityClaims as any;
    return claims?.name || claims?.preferred_username || 'N/A';
  }

  getUserEmail(): string {
    const claims = this.authService.identityClaims as any;
    return claims?.email || 'N/A';
  }

  getUserSubject(): string {
    const claims = this.authService.identityClaims as any;
    return claims?.sub || 'N/A';
  }

  getIdentityClaims(): any {
    return this.authService.identityClaims;
  }

  getTokenRemainingTime(): any {
    const claims: any = this.authService.identityClaims;
    if (!claims || !claims.exp) {
      return 'No token or exp claim';
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingSeconds = claims.exp - currentTime;

    if (remainingSeconds <= 0) {
      return 'Token expired';
    }

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    console.log(`Token expires in: ${minutes} min ${seconds} sec`);
    return `${minutes} min ${seconds} sec`;
  }


  refreshToken(): void {
    this.authService.refresh();
  }

  logout(): void {
    this.authService.logout();
  }

  makeApiCall(): void {
    this.loading = true;
    this.apiResult = null;
    this.apiError = null;

    // Example API call - replace with your actual API endpoint
    // This is just a demo using a public API
    this.http.get('https://jsonplaceholder.typicode.com/posts/1')
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.apiResult = result;
        },
        error: (error) => {
          this.loading = false;
          this.apiError = error.message || 'An error occurred';
        }
      });
  }
}
