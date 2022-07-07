import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { RouterComponent } from './components/router/router.component';
import { BusyIfDirective } from './directives/busy-if.directive';
import { LazyLoadDirective } from './directives/lazy-load.directive';
import { FormatArtworkUrlPipe } from './pipes/format-artwork-url.pipe';
import { MomentDateTimePipe } from './pipes/moment-date-time.pipe';
import { PermissionPipe } from './pipes/permission.pipe';
import { PermissionAllPipe } from './pipes/permissionAll.pipe';
import { PermissionAnyPipe } from './pipes/permissionAny.pipe';
import { ConfigurationService } from './services/configuration.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { OidcHelperService } from './services/oidc-helper.service';

const DIRECTIVES = [
  BusyIfDirective,
  LazyLoadDirective,
]

const PIPES = [
  MomentDateTimePipe,
  PermissionPipe,
  PermissionAllPipe,
  PermissionAnyPipe,
  FormatArtworkUrlPipe,
]

const COMPONENTS = [
  RouterComponent,
  PageHeaderComponent,
];

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  DragDropModule,
  ScrollingModule,
  FlexLayoutModule,
]

const MATERIAL_MODULES = [
  MatExpansionModule,
  MatBottomSheetModule,
  MatToolbarModule,
  MatTabsModule,
  MatSnackBarModule,
  MatSliderModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatCardModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatSidenavModule,
]

@NgModule({
  imports: [MODULES, MATERIAL_MODULES],
  declarations: [COMPONENTS, DIRECTIVES, PIPES],
  exports: [COMPONENTS, MODULES, MATERIAL_MODULES, DIRECTIVES, PIPES],
  providers: [
    ConfigurationService,
    LocalStoreManager,
    OidcHelperService,
  ]
})
export class SharedModule { }
