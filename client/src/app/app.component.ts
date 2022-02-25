import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastaConfig } from 'ngx-toasta';
import { ConfigurationService } from './shared/services/configuration.service';
import { LocalStoreManager } from './shared/services/local-store-manager.service';

@Component({
  selector: 'fsc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'flittstream-client';
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  opened = true;
  mode: MatDrawerMode = 'side';
  isMobile = false;

  constructor(
    storageManager: LocalStoreManager,
    public configurations: ConfigurationService,
    public router: Router,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private toastaConfig: ToastaConfig,
    private spinnerService: NgxSpinnerService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.toastaConfig.theme = 'material';
    this.toastaConfig.position = 'top-right';
    this.toastaConfig.limit = 100;
    this.toastaConfig.showClose = true;
    this.toastaConfig.showDuration = false;

    storageManager.initializeStorageSyncListener();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
