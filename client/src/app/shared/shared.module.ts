import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RouterComponent } from './components/router/router.component';

const COMPONENTS = [
  RouterComponent
];

const PRIMENG_MODULES = [
  InputTextModule,
  PasswordModule,
  ButtonModule,
  FieldsetModule,
  CardModule,
]

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
]

@NgModule({
  imports: [MODULES, PRIMENG_MODULES],
  declarations: [COMPONENTS],
  exports: [COMPONENTS, MODULES, PRIMENG_MODULES],
})
export class SharedModule { }
