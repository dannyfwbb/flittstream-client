import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ScreenComponent } from './components/screen/screen.component';
import { CORE_ROUTES } from './core.routes';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(CORE_ROUTES),
  ],
  declarations: [ScreenComponent]
})
export class CoreModule { }
