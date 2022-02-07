import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterComponent } from './components/router/router.component';

const COMPONENTS = [
  RouterComponent
];

const MODULES = [
  CommonModule,
  RouterModule,
]

@NgModule({
  imports: [MODULES],
  declarations: [COMPONENTS],
  exports: [COMPONENTS, MODULES],
})
export class SharedModule { }
