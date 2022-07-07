import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DBkeys } from './db-keys';
import { LocalStoreManager } from './local-store-manager.service';
import { Utilities } from './utilities';

interface UserConfiguration {
  homeUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(
    private localStorage: LocalStoreManager) {
    this.loadLocalChanges();
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

  public baseUrl = environment.baseUrl || Utilities.baseUrl();
  public tokenUrl = environment.tokenUrl || environment.baseUrl || Utilities.baseUrl();
  public loginUrl = environment.loginUrl;
  public fallbackBaseUrl = '';

  private _homeUrl: string = null;
  private onConfigurationImported$: Subject<boolean> = new Subject<boolean>();

  configurationImported$ = this.onConfigurationImported$.asObservable();

  private loadLocalChanges(): void {
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

      if (importValue.homeUrl != null) {
        this.homeUrl = importValue.homeUrl;
      }
    }

    this.onConfigurationImported$.next(true);
  }

  public export(changesOnly = true): string {
    const exportValue: UserConfiguration = {
      homeUrl: changesOnly ? this._homeUrl : this.homeUrl,
    };

    return JSON.stringify(exportValue);
  }

  public clearLocalChanges(): void {
    this._homeUrl = null;

    this.localStorage.deleteData(DBkeys.HOME_URL);
  }
}
