import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { mergeMap, of as just, takeUntil } from 'rxjs';
import { BaseComponent } from './shared/bases/base.component';
import { AuthService } from './shared/services/auth.service';
import { LocalStoreManager } from './shared/services/local-store-manager.service';

@Component({
  selector: 'fsc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AppComponent extends BaseComponent {
  title = 'flittstream-client';
  loaded = false;
  logged = false;

  constructor(storageManager: LocalStoreManager, private authService: AuthService) {
    super();
    storageManager.initializeStorageSyncListener();

    this.authService.getLoginStatusEvent()
      .pipe(
        mergeMap((logged) => {
          this.loaded = false;
          this.logged = logged;
          return this.logged ? this.authService.getUserMetadata() : just(null);
        }),
        takeUntil(this.destroy$),
      ).subscribe((_metadata) => {
        this.loaded = true;
      });

    this.authService.checkStatus();
  }
}
