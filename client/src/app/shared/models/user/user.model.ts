export class User {
  constructor(
    id?: string,
    userName?: string,
    email?: string,
    roles?: string[]
  ) {

    this.id = id;
    this.userName = userName;
    this.email = email;
    this.roles = roles;
  }

  get friendlyName(): string {
    return this.userName;
  }

  public id: string;
  public userName: string;
  public email: string;
  public emailConfirmed: boolean;
  public isEnabled: boolean;
  public isLockedOut: boolean;
  public roles: string[];
  public createDate: Date;
  public updateDate: Date;
}
