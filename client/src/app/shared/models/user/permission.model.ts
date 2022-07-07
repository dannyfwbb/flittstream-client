export type PermissionNames =
    'View Users' | 'Create Users' | 'Edit Users' | 'Delete Users' |
    'View Roles' | 'Manage Roles' | 'Assign Roles';

export type PermissionValues =
    'users.view' | 'users.create' | 'users.edit' | 'users.delete' |
    'roles.view' | 'roles.manage' | 'roles.assign';

export class Permission {
  public static readonly viewUsersPermission: PermissionValues = 'users.view';
  public static readonly createUsersPermission: PermissionValues = 'users.create';
  public static readonly editUsersPermission: PermissionValues = 'users.edit';
  public static readonly deleteUsersPermission: PermissionValues = 'users.delete';

  public static readonly viewRolesPermission: PermissionValues = 'roles.view';
  public static readonly manageRolesPermission: PermissionValues = 'roles.manage';
  public static readonly assignRolesPermission: PermissionValues = 'roles.assign';

  constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
    this.name = name;
    this.value = value;
    this.groupName = groupName;
    this.description = description;
  }

  public name: PermissionNames;
  public value: PermissionValues;
  public groupName: string;
  public description: string;
}
