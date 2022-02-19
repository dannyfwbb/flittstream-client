import { Routes } from '@angular/router';
import { RouterComponent } from '../shared/components/router/router.component';
import { AppContainerComponent } from './components/app-container/app-container.component';
import { AuthGuard } from './guards/auth.guard';

export const CORE_ROUTES: Routes = [
  {
    path: 'auth',
    component: RouterComponent,
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: AppContainerComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
