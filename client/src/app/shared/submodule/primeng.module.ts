import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TreeModule } from 'primeng/tree';

const PRIME_NG_MODULES = [
  TableModule,
  ToolbarModule,
  ButtonModule,
  InputTextModule,
  PaginatorModule,
  DynamicDialogModule,
  PasswordModule,
  CheckboxModule,
  MultiSelectModule,
  ToastModule,
  ConfirmPopupModule,
  InputTextareaModule,
  TreeModule,
  TabViewModule,
];

@NgModule({
  imports: [
    ...PRIME_NG_MODULES
  ],
  exports: [
    ...PRIME_NG_MODULES
  ],
})
export class SharedPrimengModule { }
