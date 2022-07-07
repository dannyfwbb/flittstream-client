import { Permission } from '../../../shared/models/user/permission.model';

export interface RoleCreateContext {
  name: string;
  description: string;
  permissions: Permission[];
}
