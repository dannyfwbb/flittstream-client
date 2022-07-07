import { Pipe, PipeTransform } from '@angular/core';
import { PermissionValues } from '../models/user/permission.model';
import { PermissionService } from '../services/permission.service';

@Pipe({
  name: 'permissionAll'
})
export class PermissionAllPipe implements PipeTransform {
  constructor(private permission: PermissionService) {
    //
  }

  transform(permissions: PermissionValues[]): boolean {
    console.log(permissions);
    return this.permission.isGrantedAll(permissions);
  }
}
