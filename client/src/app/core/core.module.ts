import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LoginControlComponent } from './components/login/login-control.component';
import { LoginDialogComponent } from './components/login/login-dialog.component';
import { CORE_ROUTES } from './core.routes';

const COMPONENTS = [
  LoginControlComponent,
  LoginDialogComponent,
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(CORE_ROUTES),
  ],
  declarations: [COMPONENTS]
})
export class CoreModule { }
