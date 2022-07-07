export interface UserEditContext {
  id: string;
  username: string;
  email: string;
  currentPassword?: string;
  newPassword: string;
  roles: string[];
  enabled: boolean;
  locked: boolean;
}
