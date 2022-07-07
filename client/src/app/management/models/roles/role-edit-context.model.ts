import { Permission } from '../../../shared/models/user/permission.model';

export interface RoleEditContext {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}
