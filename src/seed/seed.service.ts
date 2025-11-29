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
