import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SharedPrimengModule } from '../shared/submodule/primeng.module';
import { ConfigurationComponent } from './components/configuration/configuration.component';
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
  ConfigurationComponent,
];

@NgModule({
  imports: [
    SharedModule,
    SharedPrimengModule,
    CommonModule,
    RouterModule.forChild(MANAGEMENT_ROUTES),
  ],
  declarations: [COMPONENTS]
})
export class ManagementModule { }
