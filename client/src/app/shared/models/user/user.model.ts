export class User {
  constructor(
    id?: string,
    userName?: string,
    email?: string
  ) {

    this.id = id;
    this.userName = userName;
    this.email = email;
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
  public createDate: Date;
  public updateDate: Date;
}
