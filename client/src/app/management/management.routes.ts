import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';

export const MANAGEMENT_ROUTES: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canActivate: [AuthGuard]
  },
];
