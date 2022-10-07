import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Permission } from '../../shared/models/user/permission.model';
import { Role } from '../../shared/models/user/role.model';
import { User } from '../../shared/models/user/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { AccountApiService } from '../api/account.api';
import { RoleContext } from '../models/roles/role-context.model';
import { RoleCreateContext } from '../models/roles/role-create-context.model';
import { RoleEditContext } from '../models/roles/role-edit-context.model';
import { RolesContext } from '../models/roles/roles-context.model';
import { UserContext } from '../models/users/user-context.model';
import { UserCreateContext } from '../models/users/user-create-context.model';
import { UserEditContext } from '../models/users/user-edit-context.model';
import { UsersContext } from '../models/users/users-context.model';


export type RolesChangedOperation = 'add' | 'delete' | 'modify';
export interface RolesChangedEventArg { roles: Role[] | string[]; operation: RolesChangedOperation; }

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public static readonly roleAddedOperation: RolesChangedOperation = 'add';
  public static readonly roleDeletedOperation: RolesChangedOperation = 'delete';
  public static readonly roleModifiedOperation: RolesChangedOperation = 'modify';

  private _rolesChanged$ = new Subject<RolesChangedEventArg>();

  constructor(
    private authService: AuthService,
    private api: AccountApiService) {
    //
  }

  getUser(userId?: string): Observable<UserContext> {
    return this.api.getUser<UserContext>(userId);
  }

  getUserHasPassword(userId?: string): Observable<boolean> {
    return this.api.getUserHasPassword<boolean>(userId);
  }

  getUsers(page?: number, pageSize?: number, filter?: string): Observable<UsersContext> {
    return this.api.getUsers<UsersContext>(page, pageSize, filter);
  }

  updateUser(user: UserEditContext): Observable<UserContext> {
    return this.api.updateUser(user);
  }

  createNewUser(user: UserCreateContext): Observable<UserContext> {
    return this.api.createNewUser<UserContext>(user, false);
  }

  getUserPreferences() {
    return this.api.getUserPreferences<string>();
  }

  updateUserPreferences(configuration: string) {
    return this.api.updateUserPreferences(configuration);
  }

  deleteUser(userId: string): Observable<User> {
    return this.api.deleteUser<User>(userId);
  }

  sendConfirmEmail() {
    return this.api.sendConfirmEmail();
  }

  confirmUserAccount(userId: string, confirmationCode: string) {
    return this.api.confirmUserAccount(userId, confirmationCode);
  }

  recoverPassword(usernameOrEmail: string) {
    return this.api.recoverPassword(usernameOrEmail);
  }

  resetPassword(usernameOrEmail: string, newPassword: string, resetCode: string) {
    return this.api.resetPassword(usernameOrEmail, newPassword, resetCode);
  }

  unblockUser(userId: string) {
    return this.api.unblockUser(userId);
  }

  getRole(roleId: string): Observable<RoleContext> {
    return this.api.getRole<RoleContext>(roleId);
  }

  getRoles(page?: number, pageSize?: number): Observable<RolesContext> {
    return this.api.getRoles<RolesContext>(page, pageSize);
  }

  createNewRole(role: RoleCreateContext): Observable<RoleContext> {
    return this.api.createNewRole<RoleContext>(role);
  }

  updateRole(role: RoleEditContext): Observable<RoleContext> {
    return this.api.updateRole<RoleContext>(role);
  }

  deleteRole(roleId: string): Observable<Role> {
    return this.api.deleteRole<Role>(roleId);
  }

  getPermissions() {
    return this.api.getPermissions<Permission[]>();
  }

  get currentUser() {
    return this.authService.currentUser;
  }
}
