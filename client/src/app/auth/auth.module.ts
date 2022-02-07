import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AUTH_ROUTES } from './auth.routes';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(AUTH_ROUTES),
  ],
  declarations: [LoginComponent]
})
export class AuthModule { }
