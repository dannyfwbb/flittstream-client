import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DBkeys } from './db-keys';
import { LocalStoreManager } from './local-store-manager.service';
import { Utilities } from './utilities';

interface UserConfiguration {
  homeUrl: string;
  themeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private localStorage: LocalStoreManager) {
    this.loadLocalChanges();
  }

  set themeId(value: number) {
    this._themeId = value;
    this.saveToLocalStore(value, DBkeys.THEME_ID);
  }
  get themeId() {
    return this._themeId || ConfigurationService.defaultThemeId;
  }

  set homeUrl(value: string) {
    this._homeUrl = value;
    this.saveToLocalStore(value, DBkeys.HOME_URL);
  }
  get homeUrl() {
    return this._homeUrl || ConfigurationService.defaultHomeUrl;
  }

  public static readonly appVersion: string = '1.0.0';

  public static readonly defaultHomeUrl: string = '/';
  public static readonly defaultThemeId: number = 1;

  public baseUrl = environment.baseUrl || Utilities.baseUrl();
  public tokenUrl = environment.tokenUrl || environment.baseUrl || Utilities.baseUrl();
  public loginUrl = environment.loginUrl;
  public googleClientId = environment.googleClientId;
  public facebookClientId = environment.facebookClientId;
  public fallbackBaseUrl = '';

  private _homeUrl: string = null;
  private _themeId: number = null;
  private onConfigurationImported$: Subject<boolean> = new Subject<boolean>();

  configurationImported$ = this.onConfigurationImported$.asObservable();

  private loadLocalChanges(): void {
    if (this.localStorage.exists(DBkeys.THEME_ID)) {
      this._themeId = this.localStorage.getDataObject<number>(DBkeys.THEME_ID);
    }

    if (this.localStorage.exists(DBkeys.HOME_URL)) {
      this._homeUrl = this.localStorage.getDataObject<string>(DBkeys.HOME_URL);
    }
  }

  private saveToLocalStore(data: unknown, key: string): void {
    setTimeout(() => this.localStorage.savePermanentData(data, key));
  }

  public import(jsonValue: string): void {
    this.clearLocalChanges();

    if (jsonValue) {
      const importValue: UserConfiguration = Utilities.JsonTryParse(jsonValue);

      if (importValue.themeId != null) {
        this.themeId = importValue.themeId;
      }

      if (importValue.homeUrl != null) {
        this.homeUrl = importValue.homeUrl;
      }
    }

    this.onConfigurationImported$.next(true);
  }

  public export(changesOnly = true): string {
    const exportValue: UserConfiguration = {
      themeId: changesOnly ? this._themeId : this.themeId,
      homeUrl: changesOnly ? this._homeUrl : this.homeUrl,
    };

    return JSON.stringify(exportValue);
  }

  public clearLocalChanges(): void {
    this._themeId = null;
    this._homeUrl = null;

    this.localStorage.deleteData(DBkeys.THEME_ID);
    this.localStorage.deleteData(DBkeys.HOME_URL);
  }
}
