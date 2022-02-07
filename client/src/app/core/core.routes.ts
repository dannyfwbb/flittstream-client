import { Routes } from '@angular/router';
import { RouterComponent } from '../shared/components/router/router.component';
import { ScreenComponent } from './screen/screen.component';

export const CORE_ROUTES: Routes = [
  {
    path: '',
    component: ScreenComponent,
  },
  {
    path: 'auth',
    component: RouterComponent,
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
