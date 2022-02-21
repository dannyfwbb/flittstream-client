import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Router } from '@angular/router';
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

  opened = false;
  mode: MatDrawerMode = 'side';
  isMobile = false;

  constructor(
    storageManager: LocalStoreManager,
    public configurations: ConfigurationService,
    public router: Router,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    breakpointObserver: BreakpointObserver
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    storageManager.initializeStorageSyncListener();

    breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe((result) => {
      if (result.matches) {
        this.opened = false;
        this.mode = 'over';
        this.isMobile = true;
      } else {
        this.opened = true;
        this.mode = 'side';
        this.isMobile = false;
      }
    });

    router.events.subscribe((event) => {
      if ( this.isMobile ) {
        this.opened = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
