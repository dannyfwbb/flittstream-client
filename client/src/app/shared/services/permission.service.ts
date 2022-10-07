import { Injectable } from '@angular/core';
import { PermissionValues } from '../models/user/permission.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private authService: AuthService) {
    //
  }

  isGranted(permissionValue: PermissionValues): boolean {
    console.log();
    return this.authService.userPermissions.some((p) => p == permissionValue);
  }

  isGrantedAny(permissionValues: PermissionValues[]): boolean {
    if (!permissionValues) {
      return false;
    }

    for (const permission of permissionValues) {
      if (this.isGranted(permission)) {
        return true;
      }
    }

    return false;
  }

  isGrantedAll(permissionValues: PermissionValues[]): boolean {
    if (!permissionValues) {
      return false;
    }

    for (const permission of permissionValues) {
      if (!this.isGranted(permission)) {
        return false;
      }
    }

    return true;
  }
}
