import { Permission } from '../../../shared/models/user/permission.model';

export class RoleContext {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: Permission[];
  createDate: Date;
  updateDate: Date;
}
