import { PermissionValues } from './permission.model';

export interface UserMetadata {
  userName: string;
  email: string;
  permissions: PermissionValues[];
}
