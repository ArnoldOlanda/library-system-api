import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/auth/entities/permission.entity';
import { Role } from 'src/auth/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { encryptText } from 'src/utils';

@Injectable()
export class SeedService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ){}

    async seedDataBase(){

		const alreadySeeded = await this.roleRepository.findOne({where: {name: 'admin'}});
		if(alreadySeeded){
			return {
				message: 'Database already seeded',
			}
		}

        //create roles
        const roles = this.roleRepository.create([
            {name: 'admin', description: 'Admin role'},
            {name: 'user', description: 'User role'},
        ])
        await this.roleRepository.save(roles);

        //create permissions
        const permissions = this.permissionRepository.create([
            {name: 'manage:user', description: 'Manage users'},
            {name: 'create:user', description: 'Create user'},
            {name: 'read:user', description: 'Read user'},
            {name: 'update:user', description: 'Update user'},
            {name: 'delete:user', description: 'Delete user'},
            {name: 'manage:role', description: 'Manage roles'},
            {name: 'create:role', description: 'Create role'},
            {name: 'read:role', description: 'Read role'},
            {name: 'update:role', description: 'Update role'},
            {name: 'delete:role', description: 'Delete role'},
            {name: 'manage:permission', description: 'Manage permissions'},
            {name: 'create:permission', description: 'Create permission'},
            {name: 'read:permission', description: 'Read permission'},
            {name: 'update:permission', description: 'Update permission'},
            {name: 'delete:permission', description: 'Delete permission'},
            // Categorías
            {name: 'create:categoria', description: 'Create categoria'},
            {name: 'read:categoria', description: 'Read categoria'},
            {name: 'update:categoria', description: 'Update categoria'},
            {name: 'delete:categoria', description: 'Delete categoria'},
            // Productos
            {name: 'create:producto', description: 'Create producto'},
            {name: 'read:producto', description: 'Read producto'},
            {name: 'update:producto', description: 'Update producto'},
            {name: 'delete:producto', description: 'Delete producto'},
            // Proveedores
            {name: 'create:proveedor', description: 'Create proveedor'},
            {name: 'read:proveedor', description: 'Read proveedor'},
            {name: 'update:proveedor', description: 'Update proveedor'},
            {name: 'delete:proveedor', description: 'Delete proveedor'},
            // Compras
            {name: 'create:compra', description: 'Create compra'},
            {name: 'read:compra', description: 'Read compra'},
            {name: 'update:compra', description: 'Update compra'},
            {name: 'delete:compra', description: 'Delete compra'},
            // Clientes
            {name: 'create:cliente', description: 'Create cliente'},
            {name: 'read:cliente', description: 'Read cliente'},
            {name: 'update:cliente', description: 'Update cliente'},
            {name: 'delete:cliente', description: 'Delete cliente'},
            // Ventas
            {name: 'create:venta', description: 'Create venta'},
            {name: 'read:venta', description: 'Read venta'},
            {name: 'update:venta', description: 'Update venta'},
            {name: 'delete:venta', description: 'Delete venta'},
            // Arqueos de Caja
            {name: 'create:arqueo', description: 'Create arqueo'},
            {name: 'read:arqueo', description: 'Read arqueo'},
            {name: 'update:arqueo', description: 'Update arqueo'},
            {name: 'delete:arqueo', description: 'Delete arqueo'},
        ])
        await this.permissionRepository.save(permissions);

        //assign permissions to roles
        const adminRole = roles.find(role => role.name === 'admin');
        
        if(!adminRole){
            throw new Error('Admin role not found');
        }

        adminRole.permissions = permissions;
        await this.roleRepository.save(adminRole);

        //create admin user
        const admin = this.userRepository.create({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: encryptText('password'),
            roles: [adminRole],
        })
        await this.userRepository.save(admin);

		return {
			message: 'Database seeded successfully',
		}
    }
}
