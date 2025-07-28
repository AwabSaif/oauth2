import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';
import { authGuard } from './auth.guard';
import { PublicTestComponent } from './public-test/public-test.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'public', component: PublicTestComponent },
  { path: 'protected', component: ProtectedComponent, canActivate: [authGuard] },
];
