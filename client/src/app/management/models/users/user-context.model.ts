export class UserContext {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  isEnabled: boolean;
  isLockedOut: boolean;
  roles: string[];
  createDate: Date;
  updateDate: Date;
}
