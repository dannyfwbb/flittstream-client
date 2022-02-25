import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Permission, PermissionValues } from '../../shared/models/user/permission.model';
import { Role } from '../../shared/models/user/role.model';
import { UserEdit } from '../../shared/models/user/user-edit.model';
import { User } from '../../shared/models/user/user.model';
import { AccountApiService } from '../../_api/account.api';
import { AuthService } from '../../_services/auth.service';


export type RolesChangedOperation = 'add' | 'delete' | 'modify';
export interface RolesChangedEventArg { roles: Role[] | string[]; operation: RolesChangedOperation; }

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public static readonly roleAddedOperation: RolesChangedOperation = 'add';
  public static readonly roleDeletedOperation: RolesChangedOperation = 'delete';
  public static readonly roleModifiedOperation: RolesChangedOperation = 'modify';

  private _rolesChanged$ = new Subject<RolesChangedEventArg>();

  constructor(
    private authService: AuthService,
    private api: AccountApiService) {

  }

  getUser(userId?: string) {
    return this.api.getUserEndpoint<User>(userId);
  }

  getUserHasPassword(userId?: string) {
    return this.api.getUserHasPasswordEndpoint<boolean>(userId || this.currentUser.id);
  }

  getUserAndRoles(userId?: string) {

    return forkJoin([this.api.getUserEndpoint<User>(userId), this.api.getRolesEndpoint<Role[]>()]);
  }

  getUsers(count?: number, skipCount?: number) {
    return this.api.getUsersEndpoint<User[]>(count, skipCount);
  }

  getUsersAndRoles(page?: number, pageSize?: number) {
    return forkJoin([this.api.getUsersEndpoint<User[]>(page, pageSize), this.api.getRolesEndpoint<Role[]>()]);
  }

  updateUser(user: UserEdit) {
    if (user.id) {
      return this.api.getUpdateUserEndpoint(user, user.id);
    } else {
      return this.api.getUserByUserNameEndpoint<User>(user.userName).pipe(
        mergeMap((foundUser) => {
          user.id = foundUser.id;
          return this.api.getUpdateUserEndpoint(user, user.id);
        }));
    }
  }

  newUser(user: UserEdit, isPublicRegistration?: boolean) {
    return this.api.getNewUserEndpoint<User>(user, isPublicRegistration);
  }

  getUserPreferences() {
    return this.api.getUserPreferencesEndpoint<string>();
  }

  updateUserPreferences(configuration: string) {
    return this.api.getUpdateUserPreferencesEndpoint(configuration);
  }

  deleteUser(userOrUserId: string | User): Observable<User> {
    if (typeof userOrUserId === 'string' || userOrUserId instanceof String) {
      return this.api.getDeleteUserEndpoint<User>(userOrUserId as string).pipe<User>(
        tap((data) => this.onRolesUserCountChanged(data.roles)));
    } else if (userOrUserId.id) {
      return this.deleteUser(userOrUserId.id);
    } else {
      return this.api.getUserByUserNameEndpoint<User>(userOrUserId.userName).pipe<User>(
        mergeMap((user) => this.deleteUser(user.id)));
    }
  }

  sendConfirmEmail() {
    return this.api.getSendConfirmEmailEndpoint();
  }

  confirmUserAccount(userId: string, confirmationCode: string) {
    return this.api.getConfirmUserAccountEndpoint(userId, confirmationCode);
  }

  recoverPassword(usernameOrEmail: string) {
    return this.api.getRecoverPasswordEndpoint(usernameOrEmail);
  }

  resetPassword(usernameOrEmail: string, newPassword: string, resetCode: string) {
    return this.api.getResetPasswordEndpoint(usernameOrEmail, newPassword, resetCode);
  }

  unblockUser(userId: string) {
    return this.api.getUnblockUserEndpoint(userId);
  }

  userHasPermission(permissionValue: PermissionValues): boolean {
    return this.permissions.some((p) => p == permissionValue);
  }

  getRoles(page?: number, pageSize?: number) {
    return this.api.getRolesEndpoint<Role[]>(page, pageSize);
  }

  getRolesAndPermissions(page?: number, pageSize?: number) {
    return forkJoin([this.api.getRolesEndpoint<Role[]>(page, pageSize), this.api.getPermissionsEndpoint<Permission[]>()]);
  }

  updateRole(role: Role) {
    if (role.id) {
      return this.api.getUpdateRoleEndpoint(role, role.id).pipe(
        tap((_data) => this.onRolesChanged([role], UsersService.roleModifiedOperation)));
    } else {
      return this.api.getRoleByRoleNameEndpoint<Role>(role.name).pipe(
        mergeMap((foundRole) => {
          role.id = foundRole.id;
          return this.api.getUpdateRoleEndpoint(role, role.id);
        }),
        tap((_data) => this.onRolesChanged([role], UsersService.roleModifiedOperation)));
    }
  }

  newRole(role: Role) {
    return this.api.getNewRoleEndpoint<Role>(role).pipe<Role>(
      tap((_data) => this.onRolesChanged([role], UsersService.roleAddedOperation)));
  }

  deleteRole(roleOrRoleId: string | Role): Observable<Role> {
    if (typeof roleOrRoleId === 'string' || roleOrRoleId instanceof String) {
      return this.api.getDeleteRoleEndpoint<Role>(roleOrRoleId as string).pipe<Role>(
        tap((data) => this.onRolesChanged([data], UsersService.roleDeletedOperation)));
    } else if (roleOrRoleId.id) {
      return this.deleteRole(roleOrRoleId.id);
    } else {
      return this.api.getRoleByRoleNameEndpoint<Role>(roleOrRoleId.name).pipe<Role>(
        mergeMap((role) => this.deleteRole(role.id)));
    }
  }

  getPermissions() {
    return this.api.getPermissionsEndpoint<Permission[]>();
  }

  private onRolesChanged(roles: Role[] | string[], op: RolesChangedOperation) {
    this._rolesChanged$.next({ roles, operation: op });
  }

  onRolesUserCountChanged(roles: Role[] | string[]) {
    return this.onRolesChanged(roles, UsersService.roleModifiedOperation);
  }

  getRolesChangedEvent(): Observable<RolesChangedEventArg> {
    return this._rolesChanged$.asObservable();
  }

  get permissions(): PermissionValues[] {
    return this.authService.userPermissions;
  }

  get currentUser() {
    return this.authService.currentUser;
  }
}
