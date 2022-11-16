import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './service/auth-guard/auth-guard.service';
import { AdminAuthGuardService as AdminAuthGuard } from './service/admin-auth-guard/admin-auth-guard.service';
import { SalesAuthGuardService as SalesAuthGuard } from './service/sales-auth-guard/sales-auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  {
    path: 'sales',
    canActivate: [AuthGuard, SalesAuthGuard],
    loadChildren: () => {
      return import('./layout/layout.module').then((m) => m.LayoutModule);
    }
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminAuthGuard],
    loadChildren: () => {
      return import('./admin-layout/admin-layout.module').then((m) => m.AdminLayoutModule);
    }
  },
  {
    path: 'auth',
    loadChildren: () => {
      return import('./auth/auth.module').then((m) => m.AuthModule);
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
