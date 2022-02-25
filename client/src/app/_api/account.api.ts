import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../shared/api/base.api';
import { ConfigurationService } from '../shared/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService extends ApiBaseService {
  private readonly _usersUrl: string = '/api/account/users';
  private readonly _usersPublicUrl: string = '/api/account/public/users';
  private readonly _userByUserNameUrl: string = '/api/account/users/username';
  private readonly _userHasPasswordUrl: string = '/api/account/users/haspassword';
  private readonly _currentUserUrl: string = '/api/account/users/me';
  private readonly _currentUserPreferencesUrl: string = '/api/account/users/me/preferences';
  private readonly _sendConfirmEmailUrl: string = '/api/account/users/me/sendconfirmemail';
  private readonly _confirmEmailUrl: string = '/api/account/public/confirmemail';
  private readonly _recoverPasswordUrl: string = '/api/account/public/recoverpassword';
  private readonly _resetPasswordUrl: string = '/api/account/public/resetpassword';
  private readonly _unblockUserUrl: string = '/api/account/users/unblock';
  private readonly _rolesUrl: string = '/api/account/roles';
  private readonly _roleByRoleNameUrl: string = '/api/account/roles/name';
  private readonly _permissionsUrl: string = '/api/account/permissions';

  get usersUrl() { return this.configurations.baseUrl + this._usersUrl; }
  get usersPublicUrl() { return this.configurations.baseUrl + this._usersPublicUrl; }
  get userByUserNameUrl() { return this.configurations.baseUrl + this._userByUserNameUrl; }
  get userHasPasswordUrl() { return this.configurations.baseUrl + this._userHasPasswordUrl; }
  get currentUserUrl() { return this.configurations.baseUrl + this._currentUserUrl; }
  get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._currentUserPreferencesUrl; }
  get sendConfirmEmailUrl() { return this.configurations.baseUrl + this._sendConfirmEmailUrl; }
  get confirmEmailUrl() { return this.configurations.baseUrl + this._confirmEmailUrl; }
  get recoverPasswordUrl() { return this.configurations.baseUrl + this._recoverPasswordUrl; }
  get resetPasswordUrl() { return this.configurations.baseUrl + this._resetPasswordUrl; }
  get unblockUserUrl() { return this.configurations.baseUrl + this._unblockUserUrl; }
  get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
  get roleByRoleNameUrl() { return this.configurations.baseUrl + this._roleByRoleNameUrl; }
  get permissionsUrl() { return this.configurations.baseUrl + this._permissionsUrl; }


  constructor(private configurations: ConfigurationService, private http: HttpClient) {
    super();
  }

  getUserEndpoint<T>(userId?: string): Observable<T> {
    const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
    return this.http.get<T>(endpointUrl);
  }

  getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
    const endpointUrl = `${this.userByUserNameUrl}/${userName}`;
    return this.http.get<T>(endpointUrl);
  }

  getUserHasPasswordEndpoint<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.userHasPasswordUrl}/${userId}`;
    return this.http.get<T>(endpointUrl);
  }

  getUsersEndpoint<T>(count?: number, skipCount?: number): Observable<T> {
    const endpointUrl = `${this.usersUrl}/${count}/${skipCount}`;
    return this.http.get<T>(endpointUrl);
  }

  getNewUserEndpoint<T>(userObject: any, isPublicRegistration?: boolean): Observable<T> {
    const endpointUrl = isPublicRegistration ? this.usersPublicUrl : this.usersUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(userObject));
  }

  getUpdateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
    const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
    return this.http.put<T>(endpointUrl, JSON.stringify(userObject));
  }

  getUserPreferencesEndpoint<T>(): Observable<T> {
    return this.http.get<T>(this.currentUserPreferencesUrl);
  }

  getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
    return this.http.put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration));
  }

  getSendConfirmEmailEndpoint<T>(): Observable<T> {
    const endpointUrl = this.sendConfirmEmailUrl;

    return this.http.post<T>(endpointUrl, null);
  }

  getConfirmUserAccountEndpoint<T>(userId: string, confirmationCode: string): Observable<T> {
    const endpointUrl = `${this.confirmEmailUrl}?userid=${userId}&code=${confirmationCode}`;
    return this.http.put<T>(endpointUrl, null);
  }

  getRecoverPasswordEndpoint<T>(usernameOrEmail: string): Observable<T> {
    const endpointUrl = this.recoverPasswordUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify({ usernameOrEmail }));
  }

  getResetPasswordEndpoint<T>(usernameOrEmail: string, newPassword: string, resetCode: string): Observable<T> {
    const endpointUrl = this.resetPasswordUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify({ usernameOrEmail, password: newPassword, resetCode: resetCode }));
  }

  getUnblockUserEndpoint<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.unblockUserUrl}/${userId}`;

    return this.http.put<T>(endpointUrl, null);
  }

  getDeleteUserEndpoint<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.usersUrl}/${userId}`;
    return this.http.delete<T>(endpointUrl);
  }

  getRoleEndpoint<T>(roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;
    return this.http.get<T>(endpointUrl);
  }

  getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
    const endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;
    return this.http.get<T>(endpointUrl);
  }

  getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    const endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;
    return this.http.get<T>(endpointUrl);
  }

  getNewRoleEndpoint<T>(roleObject: any): Observable<T> {
    return this.http.post<T>(this.rolesUrl, JSON.stringify(roleObject));
  }

  getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;
    return this.http.put<T>(endpointUrl, JSON.stringify(roleObject));
  }

  getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;
    return this.http.delete<T>(endpointUrl);
  }

  getPermissionsEndpoint<T>(): Observable<T> {
    return this.http.get<T>(this.permissionsUrl);
  }
}
