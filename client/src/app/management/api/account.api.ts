import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../shared/api/base.api';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { RoleCreateContext } from '../models/roles/role-create-context.model';
import { RoleEditContext } from '../models/roles/role-edit-context.model';
import { UserCreateContext } from '../models/users/user-create-context.model';
import { UserEditContext } from '../models/users/user-edit-context.model';

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

  getUser<T>(userId?: string): Observable<T> {
    const endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
    return this.http.get<T>(endpointUrl);
  }

  getUserHasPassword<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.userHasPasswordUrl}/${userId}`;
    return this.http.get<T>(endpointUrl);
  }

  getUsers<T>(page?: number, pageSize?: number, filter?: string): Observable<T> {
    let endpointUrl = this.usersUrl;
    if (page && pageSize) {
      endpointUrl = `${endpointUrl}/${page}/${pageSize}`;
    }
    if (filter) {
      endpointUrl = `${endpointUrl}/${filter}`;
    }
    return this.http.get<T>(endpointUrl);
  }

  createNewUser<T>(user: UserCreateContext, isPublicRegistration?: boolean): Observable<T> {
    const endpointUrl = isPublicRegistration ? this.usersPublicUrl : this.usersUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify(user));
  }

  updateUser<T>(user: UserEditContext): Observable<T> {
    const endpointUrl = `${this.usersUrl}/${user.id}`;
    return this.http.put<T>(endpointUrl, JSON.stringify(user));
  }

  getUserPreferences<T>(): Observable<T> {
    return this.http.get<T>(this.currentUserPreferencesUrl);
  }

  updateUserPreferences<T>(configuration: string): Observable<T> {
    return this.http.put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration));
  }

  sendConfirmEmail<T>(): Observable<T> {
    const endpointUrl = this.sendConfirmEmailUrl;
    return this.http.post<T>(endpointUrl, null);
  }

  confirmUserAccount<T>(userId: string, confirmationCode: string): Observable<T> {
    const endpointUrl = `${this.confirmEmailUrl}?userid=${userId}&code=${confirmationCode}`;
    return this.http.put<T>(endpointUrl, null);
  }

  recoverPassword<T>(usernameOrEmail: string): Observable<T> {
    const endpointUrl = this.recoverPasswordUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify({ usernameOrEmail }));
  }

  resetPassword<T>(usernameOrEmail: string, newPassword: string, resetCode: string): Observable<T> {
    const endpointUrl = this.resetPasswordUrl;
    return this.http.post<T>(endpointUrl, JSON.stringify({ usernameOrEmail, password: newPassword, resetCode: resetCode }));
  }

  unblockUser<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.unblockUserUrl}/${userId}`;
    return this.http.put<T>(endpointUrl, null);
  }

  deleteUser<T>(userId: string): Observable<T> {
    const endpointUrl = `${this.usersUrl}/${userId}`;
    return this.http.delete<T>(endpointUrl);
  }

  getRole<T>(roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;
    return this.http.get<T>(endpointUrl);
  }

  getRoles<T>(page?: number, pageSize?: number): Observable<T> {
    const endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;
    return this.http.get<T>(endpointUrl);
  }

  createNewRole<T>(role: RoleCreateContext): Observable<T> {
    return this.http.post<T>(this.rolesUrl, JSON.stringify(role));
  }

  updateRole<T>(role: RoleEditContext): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${role.id}`;
    return this.http.put<T>(endpointUrl, JSON.stringify(role));
  }

  deleteRole<T>(roleId: string): Observable<T> {
    const endpointUrl = `${this.rolesUrl}/${roleId}`;
    return this.http.delete<T>(endpointUrl);
  }

  getPermissions<T>(): Observable<T> {
    return this.http.get<T>(this.permissionsUrl);
  }
}
