import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { RouterComponent } from './components/router/router.component';
import { AlertService } from './services/alert.service';
import { ConfigurationService } from './services/configuration.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { OidcHelperService } from './services/oidc-helper.service';


const COMPONENTS = [
  RouterComponent
];

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
]

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  DragDropModule,
  ScrollingModule,
  FlexLayoutModule,
]

@NgModule({
  imports: [MODULES, MATERIAL_MODULES],
  declarations: [COMPONENTS],
  exports: [COMPONENTS, MODULES, MATERIAL_MODULES],
  providers: [
    AlertService,
    ConfigurationService,
    LocalStoreManager,
    OidcHelperService,
  ]
})
export class SharedModule { }
