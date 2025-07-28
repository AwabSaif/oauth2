import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <h2>Welcome to Angular OAuth2 OIDC Demo</h2>
      
      <div class="info-card">
        <h3>Authentication Status</h3>
        <div class="status" [class.authenticated]="authService.isAuthenticated$ | async">
          <span class="status-indicator"></span>
          {{ (authService.isAuthenticated$ | async) ? 'Authenticated' : 'Not Authenticated' }}
        </div>
      </div>

      <div class="info-card" *ngIf="authService.isAuthenticated$ | async">
        <h3>User Information</h3>
        <div class="user-details">
          <p><strong>Name:</strong> {{ getUserName() }}</p>
          <p><strong>Email:</strong> {{ getUserEmail() }}</p>
          <p><strong>Subject:</strong> {{ getUserSubject() }}</p>
        </div>
      </div>

      <div class="info-card" *ngIf="authService.isAuthenticated$ | async">
        <h3>Token Information</h3>
        <div class="token-info">
          <p><strong>Has Valid Access Token:</strong> {{ authService.hasValidToken() ? 'Yes' : 'No' }}</p>
          <p><strong>Access Token (first 50 chars):</strong> {{ getAccessTokenPreview() }}</p>
          <p><strong>ID Token (first 50 chars):</strong> {{ getIdTokenPreview() }}</p>
        </div>
      </div>

      <div class="actions">
        <ng-container *ngIf="authService.isAuthenticated$ | async; else notAuthenticated">
          <a routerLink="/protected" class="btn btn-primary">Visit Protected Page</a>
          <button (click)="refresh()" class="btn btn-secondary">Refresh Token</button>
        </ng-container>
        <ng-template #notAuthenticated>
          <button (click)="login()" class="btn btn-primary">Login to Continue</button>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 800px;
      margin: 0 auto;
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

    .status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #dc3545;
    }

    .status.authenticated .status-indicator {
      background-color: #28a745;
    }

    .user-details p,
    .token-info p {
      margin: 0.5rem 0;
      color: #495057;
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
      text-decoration: none;
      display: inline-block;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  login(): void {
    this.authService.login();
  }

  refresh(): void {
    this.authService.refresh();
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

  getAccessTokenPreview(): string {
    const token = this.authService.accessToken;
    return token ? token.substring(0, 50) + '...' : 'N/A';
  }

  getIdTokenPreview(): string {
    const token = this.authService.idToken;
    return token ? token.substring(0, 50) + '...' : 'N/A';
  }
}
