export interface UserCreateContext {
  username: string;
  email: string;
  password: string;
  roles: string[];
  enabled: boolean;
  sendInvite: boolean;
}
