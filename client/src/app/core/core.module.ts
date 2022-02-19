import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AppContainerComponent } from './components/app-container/app-container.component';
import { CORE_ROUTES } from './core.routes';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(CORE_ROUTES),
  ],
  declarations: [AppContainerComponent]
})
export class CoreModule { }
