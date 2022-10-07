import { Pipe, PipeTransform } from '@angular/core';
import { PermissionValues } from '../models/user/permission.model';
import { PermissionService } from '../services/permission.service';

@Pipe({
  name: 'permission'
})
export class PermissionPipe implements PipeTransform {
  constructor(private permission: PermissionService) {
    //
  }

  transform(permission: PermissionValues): boolean {
    return this.permission.isGranted(permission);
  }
}
