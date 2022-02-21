import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';
import { MANAGEMENT_ROUTES } from './management.routes';

const COMPONENTS = [
  UsersComponent,
  RolesComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(MANAGEMENT_ROUTES),
  ],
  declarations: [COMPONENTS]
})
export class ManagementModule { }
