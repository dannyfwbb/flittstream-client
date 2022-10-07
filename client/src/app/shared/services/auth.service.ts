import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthApiService } from '../api/auth.api';
import { AccessToken, LoginResponse } from '../models/user/login-response.model';
import { PermissionValues } from '../models/user/permission.model';
import { UserLogin } from '../models/user/user-login.model';
import { UserMetadata } from '../models/user/user-metadata.model';
import { User } from '../models/user/user.model';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-keys';
import { JwtHelper } from './jwt-helper';
import { LocalStoreManager } from './local-store-manager.service';
import { OidcHelperService } from './oidc-helper.service';
import { Utilities } from './utilities';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public get loginUrl() { return this.configurations.loginUrl; }
  public get homeUrl() { return this.configurations.homeUrl; }

  public loginRedirectUrl: string;
  public logoutRedirectUrl: string;

  public reLoginDelegate: () => void;

  private _loginStatus$ = new Subject<boolean>();

  permissions: PermissionValues[];

  constructor(
        private router: Router,
        private oidcHelperService: OidcHelperService,
        private configurations: ConfigurationService,
        private localStorage: LocalStoreManager,
        private authApi: AuthApiService) {

    this.initializeLoginStatus();
  }

  private initializeLoginStatus(): void {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }

  gotoPage(page: string, preserveParams = true): void {
    const navigationExtras: NavigationExtras = {
      queryParamsHandling: preserveParams ? 'merge' : '', preserveFragment: preserveParams
    };

    this.router.navigate([page], navigationExtras);
  }

  gotoHomePage(): void {
    this.router.navigate([this.homeUrl]);
  }

  redirectLoginUser(): void {
    const redirect =
      this.loginRedirectUrl
      && this.loginRedirectUrl != '/'
      && this.loginRedirectUrl != ConfigurationService.defaultHomeUrl
        ? this.loginRedirectUrl
        : this.homeUrl;

    this.loginRedirectUrl = null;

    const urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
    const urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

    const navigationExtras: NavigationExtras = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
      queryParamsHandling: 'merge'
    };

    this.router.navigate([urlAndParams.firstPart], navigationExtras);
  }

  redirectLogoutUser(): void {
    const redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
    this.logoutRedirectUrl = null;

    this.router.navigate([redirect]);
  }

  redirectForLogin(): void {
    this.loginRedirectUrl = this.router.url;
    this.router.navigate([this.loginUrl]);
  }

  reLogin(): void {
    if (this.reLoginDelegate) {
      this.reLoginDelegate();
    } else {
      this.redirectForLogin();
    }
  }

  refreshLogin(): Observable<void> {
    return this.oidcHelperService.refreshLogin().pipe(map((resp) => this.processLoginResponse(resp)));
  }

  login(user: UserLogin): Observable<void> {
    if (this.isLoggedIn) {
      this.logout();
    }

    return this.oidcHelperService.login(user.userName, user.password)
      .pipe(
        map((resp) => this.processLoginResponse(resp, user.rememberMe)),
      );
  }

  private processLoginResponse(response: LoginResponse, rememberMe?: boolean): void {
    const accessToken = response.access_token;

    if (accessToken == null) {
      throw new Error('accessToken cannot be null');
    }

    rememberMe = rememberMe || this.rememberMe;

    const refreshToken = response.refresh_token || this.refreshToken;
    const expiresIn = response.expires_in;
    const tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);
    const accessTokenExpiry = tokenExpiryDate;
    const jwtHelper = new JwtHelper();
    const decodedAccessToken = jwtHelper.decodeToken(accessToken) as AccessToken;

    const user = new User(decodedAccessToken.sub);
    this.saveUserDetails(decodedAccessToken.sub, accessToken, refreshToken, accessTokenExpiry, rememberMe);
    this.reevaluateLoginStatus(user);
  }

  getUserMetadata(): Observable<UserMetadata> {
    return this.authApi.getUserMetadata<UserMetadata>().pipe(map((metadata) => {
      this.permissions = metadata.permissions;
      return metadata;
    }));
  }

  private saveUserDetails(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresIn: Date,
    rememberMe: boolean
  ): void {
    if (rememberMe) {
      this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.savePermanentData(userId, DBkeys.CURRENT_USER);
    } else {
      this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.saveSyncedSessionData(userId, DBkeys.CURRENT_USER);
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
  }

  logout(): void {
    this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
    this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
    this.localStorage.deleteData(DBkeys.CURRENT_USER);

    this.configurations.clearLocalChanges();

    this.reevaluateLoginStatus();
  }

  private reevaluateLoginStatus(currentUser?: User): void {
    const user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    const isLoggedIn = user != null;
    this._loginStatus$.next(isLoggedIn);
  }

  getLoginStatusEvent(): Observable<boolean> {
    return this._loginStatus$.asObservable();
  }

  checkStatus() {
    if (this.isLoggedIn) {
      this._loginStatus$.next(true);
    } else {
      this._loginStatus$.next(false);
    }
  }

  get currentUser(): string {
    const user = this.localStorage.getDataObject<string>(DBkeys.CURRENT_USER);
    return user;
  }

  get userPermissions(): PermissionValues[] {
    return this.permissions || [];
  }

  get accessToken(): string {
    return this.oidcHelperService.accessToken;
  }

  get accessTokenExpiryDate(): Date {
    return this.oidcHelperService.accessTokenExpiryDate;
  }

  get refreshToken(): string {
    return this.oidcHelperService.refreshToken;
  }

  get isSessionExpired(): boolean {
    return this.oidcHelperService.isSessionExpired;
  }

  get isLoggedIn(): boolean {
    return this.currentUser != null;
  }

  get rememberMe(): boolean {
    return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) == true;
  }
}
