export enum Permission {
  MANAGE_USER = 'manage:user', // Only super admin can manage users
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',

  MANAGE_ROLE = 'manage:role', // Only super admin can manage roles
  CREATE_ROLE = 'create:role',
  READ_ROLE = 'read:role',
  UPDATE_ROLE = 'update:role',
  DELETE_ROLE = 'delete:role',

  MANAGE_PERMISSION = 'manage:permission', // Only super admin can manage permissions
  CREATE_PERMISSION = 'create:permission',
  READ_PERMISSION = 'read:permission',
  UPDATE_PERMISSION = 'update:permission',
  DELETE_PERMISSION = 'delete:permission',
}