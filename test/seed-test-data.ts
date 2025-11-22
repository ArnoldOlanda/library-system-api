import { DataSource } from 'typeorm';
import { Role } from 'src/auth/entities/role.entity';
import { Permission } from 'src/auth/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import { encryptText } from 'src/utils';
import { v4 as uuid } from 'uuid';

export async function seedTestData(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const userRepository = dataSource.getRepository(User);

  // Crear permisos
  const readUserPermission = permissionRepository.create({
    name: 'read:user',
    description: 'Permiso de lectura de usuarios',
  });

  const createUserPermission = permissionRepository.create({
    name: 'create:user',
    description: 'Permiso de creación de usuarios',
  });

  const updateUserPermission = permissionRepository.create({
    name: 'update:user',
    description: 'Permiso de actualización de usuarios',
  });

  const deleteUserPermission = permissionRepository.create({
    name: 'delete:user',
    description: 'Permiso de eliminación de usuarios',
  });

  const readRolePermission = permissionRepository.create({
    name: 'read:role',
    description: 'Permiso de lectura de roles',
  });

  const createRolePermission = permissionRepository.create({
    name: 'create:role',
    description: 'Permiso de creación de roles',
  });

  const updateRolePermission = permissionRepository.create({
    name: 'update:role',
    description: 'Permiso de actualización de roles',
  });

  const deleteRolePermission = permissionRepository.create({
    name: 'delete:role',
    description: 'Permiso de eliminación de roles',
  });

  const readPermissionPermission = permissionRepository.create({
    name: 'read:permission',
    description: 'Permiso de lectura de permisos',
  });

  const createPermissionPermission = permissionRepository.create({
    name: 'create:permission',
    description: 'Permiso de creación de permisos',
  });

  const updatePermissionPermission = permissionRepository.create({
    name: 'update:permission',
    description: 'Permiso de actualización de permisos',
  });

  const deletePermissionPermission = permissionRepository.create({
    name: 'delete:permission',
    description: 'Permiso de eliminación de permisos',
  });

  await permissionRepository.save([
    readUserPermission,
    createUserPermission,
    updateUserPermission,
    deleteUserPermission,
    readRolePermission,
    createRolePermission,
    updateRolePermission,
    deleteRolePermission,
    readPermissionPermission,
    createPermissionPermission,
    updatePermissionPermission,
    deletePermissionPermission,
  ]);

  // Crear roles con permisos
  const userRole = roleRepository.create({
    name: 'user',
    description: 'Usuario regular',
    permissions: [readUserPermission, readRolePermission, readPermissionPermission],
  });

  const adminRole = roleRepository.create({
    name: 'admin',
    description: 'Administrador',
    permissions: [
      readUserPermission,
      createUserPermission,
      updateUserPermission,
      deleteUserPermission,
      readRolePermission,
      createRolePermission,
      updateRolePermission,
      deleteRolePermission,
      readPermissionPermission,
      createPermissionPermission,
      updatePermissionPermission,
      deletePermissionPermission,
    ],
  });

  await roleRepository.save([userRole, adminRole]);

  // Crear usuarios de prueba
  const testUser1 = userRepository.create({
    name: 'Test User 1',
    email: 'test1@example.com',
    password: encryptText('password123'),
    avatar: 'avatar1.png',
    isActive: true,
    roles: [userRole],
  });

  const testUser2 = userRepository.create({
    name: 'Test User 2',
    email: 'test2@example.com',
    password: encryptText('password123'),
    avatar: 'avatar2.png',
    isActive: true,
    roles: [userRole],
  });

  const adminUser = userRepository.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: encryptText('admin123'),
    avatar: 'admin.png',
    isActive: true,
    roles: [adminRole],
  });

  await userRepository.save([testUser1, testUser2, adminUser]);

  return {
    users: [testUser1, testUser2, adminUser],
    roles: [userRole, adminRole],
    permissions: [
      readUserPermission,
      createUserPermission,
      updateUserPermission,
      deleteUserPermission,
      readRolePermission,
      createRolePermission,
      updateRolePermission,
      deleteRolePermission,
      readPermissionPermission,
      createPermissionPermission,
      updatePermissionPermission,
      deletePermissionPermission,
    ],
  };
}
