import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AUTH_ROUTES } from './auth.routes';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


const COMPONENTS = [
  AuthComponent,
  LoginComponent,
  RegisterComponent,
]

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(AUTH_ROUTES),
  ],
  declarations: [...COMPONENTS]
})
export class AuthModule { }
