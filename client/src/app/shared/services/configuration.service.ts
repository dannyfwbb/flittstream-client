import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ConfigurationApiService } from '../api/configuration.api';
import { DBKeys } from './db-keys';
import { LocalStorageManager } from './local-storage-manager.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(
    private localStorage: LocalStorageManager,
    private configurationApi: ConfigurationApiService,
  ) {
    //
  }

  //#region defaults
  static readonly defaultIsDemoMode = false;
  //#endregion defaults

  private appSettingsLoadedSubj$ = new BehaviorSubject<boolean>(false);
  readonly appSettingsLoaded$ = this.appSettingsLoadedSubj$.asObservable();

  private _isDemoMode = false;

  private _settings: AppSettings;
  get settings(): AppSettings {
    return this._settings;
  }

  get isDemoMode(): boolean {
    return this._isDemoMode ?? ConfigurationService.defaultIsDemoMode;
  }

  private onConfigurationImported$ = new Subject<boolean>();

  configurationImported$ = this.onConfigurationImported$.asObservable();

  loadAppConfig(): Promise<unknown> {
    return new Promise<void>((resolve, reject) => {
      if (this._settings != null) {
        resolve();
      }

      this.configurationApi.get<AppSettings>('/assets/appconfig.json')
        .subscribe({
          next: (response) => {
            this._settings = response;
            resolve();
            this.appSettingsLoadedSubj$.next(true);
          },
          error: (response: HttpErrorResponse) => {
            reject(`Can't load config: ${response.message} (${JSON.stringify(response.error)})`)
          }
        });
    });
  }

  clearLocalChanges(): void {
    this.localStorage.deleteData(DBKeys.CURRENT_USER);
  }
}

export interface AppSettings {
  domain: string;
  op: {
    url: string;
    clientId: string;
  };
  api: {
    url: string;
  };
}
