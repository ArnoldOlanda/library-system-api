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

  // Categorías
  CREATE_CATEGORIA = 'create:categoria',
  READ_CATEGORIA = 'read:categoria',
  UPDATE_CATEGORIA = 'update:categoria',
  DELETE_CATEGORIA = 'delete:categoria',

  // Productos
  CREATE_PRODUCTO = 'create:producto',
  READ_PRODUCTO = 'read:producto',
  UPDATE_PRODUCTO = 'update:producto',
  DELETE_PRODUCTO = 'delete:producto',

  // Proveedores
  CREATE_PROVEEDOR = 'create:proveedor',
  READ_PROVEEDOR = 'read:proveedor',
  UPDATE_PROVEEDOR = 'update:proveedor',
  DELETE_PROVEEDOR = 'delete:proveedor',

  // Compras
  CREATE_COMPRA = 'create:compra',
  READ_COMPRA = 'read:compra',
  UPDATE_COMPRA = 'update:compra',
  DELETE_COMPRA = 'delete:compra',

  // Clientes
  CREATE_CLIENTE = 'create:cliente',
  READ_CLIENTE = 'read:cliente',
  UPDATE_CLIENTE = 'update:cliente',
  DELETE_CLIENTE = 'delete:cliente',

  // Ventas
  CREATE_VENTA = 'create:venta',
  READ_VENTA = 'read:venta',
  UPDATE_VENTA = 'update:venta',
  DELETE_VENTA = 'delete:venta',

  // Arqueos de Caja
  CREATE_ARQUEO = 'create:arqueo',
  READ_ARQUEO = 'read:arqueo',
  UPDATE_ARQUEO = 'update:arqueo',
  DELETE_ARQUEO = 'delete:arqueo',
}