import { Pipe, PipeTransform } from '@angular/core';
import { PermissionValues } from '../models/user/permission.model';
import { PermissionService } from '../services/permission.service';

@Pipe({
  name: 'permissionAny'
})
export class PermissionAnyPipe implements PipeTransform {
  constructor(private permission: PermissionService) {
    //
  }

  transform(permissions: PermissionValues[]): boolean {
    return this.permission.isGrantedAny(permissions);
  }
}
