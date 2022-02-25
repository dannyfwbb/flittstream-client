import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { SharedModule } from '../shared/shared.module';
import { RoleEditorComponent } from './components/roles/role-editor/role-editor.component';
import { RolesComponent } from './components/roles/roles.component';
import { UserEditorComponent } from './components/users/user-editor/user-editor.component';
import { UsersComponent } from './components/users/users.component';
import { MANAGEMENT_ROUTES } from './management.routes';

const COMPONENTS = [
  UsersComponent,
  UserEditorComponent,
  RolesComponent,
  RoleEditorComponent,
];

const PRIME_NG_MODULES = [
  TableModule,
  ToolbarModule,
  ButtonModule,
  InputTextModule,
  PaginatorModule,
  DialogModule
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PRIME_NG_MODULES,
    RouterModule.forChild(MANAGEMENT_ROUTES),
  ],
  declarations: [COMPONENTS]
})
export class ManagementModule { }
