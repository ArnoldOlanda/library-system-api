import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async create(dto: CreateRoleDto): Promise<Role> {
        try {
            const role = this.roleRepository.create(dto);
            return this.roleRepository.save(role);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Role already exists');
            }
            throw new InternalServerErrorException('Error creating role');
        }
    }

    async findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async findOne(id: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }

    async update(id: string, dto: UpdateRoleDto): Promise<Role> {
        await this.roleRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<UpdateResult> {
        return await this.roleRepository.softDelete(id);
    }

    async assignPermissions(roleId: string, permissionIds: string[]) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        });

        if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }

        const permissionsToAdd = permissionIds.filter(
            (pid) => !role.permissions.some((perm) => perm.id === pid),
        );

        if (permissionsToAdd.length === 0) {
            return role;
        }

        const permissions = permissionsToAdd.map((id) => ({ id } as any));
        role.permissions = [...role.permissions, ...permissions];
        return this.roleRepository.save(role);
    }

    async removePermissions(roleId: string, permissionIds: string[]) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        });
        if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }

        role.permissions = role.permissions.filter(
            (perm) => !permissionIds.includes(perm.id),
        );

        return this.roleRepository.save(role);
    }

    async getPermissions(roleId: string) {
        const role = await this.roleRepository.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        });
        if (!role) {
            throw new NotFoundException(`Role with ID ${roleId} not found`);
        }
        return role.permissions;
    }
}
