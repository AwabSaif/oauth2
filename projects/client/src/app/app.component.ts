import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h1>Angular OAuth2 OIDC Demo</h1>
      </div>
      <div class="nav-links">
        <a routerLink="/">Home</a>
        <a routerLink="/public">public</a>
        <a routerLink="/protected">Protected</a>
        <div class="auth-actions">
          <ng-container *ngIf="authService.isAuthenticated$ | async; else notAuthenticated">
            <span class="user-info">Welcome, {{ getUserName() }}!</span>
            <button (click)="logout()" class="btn btn-secondary">Logout</button>
          </ng-container>
          <ng-template #notAuthenticated>
            <button (click)="login()" class="btn btn-primary">Login</button>
          </ng-template>
        </div>
      </div>
    </nav>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    
    .nav-brand h1 {
      margin: 0;
      color: #495057;
    }
    
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .nav-links a {
      text-decoration: none;
      color: #007bff;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .nav-links a:hover {
      background-color: #e9ecef;
    }
    
    .auth-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .user-info {
      color: #495057;
      font-weight: 500;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
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
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'angular-oauth2-oidc-standalone';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.configure();
    this.authService.runInitialLoginSequence();
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  getUserName(): string {
    const claims = this.authService.identityClaims as any;
    return claims?.name || claims?.preferred_username || 'User';
  }
}
