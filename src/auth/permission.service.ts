import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(dto);
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await  this.permissionRepository.findOne({ where: { id } });
    if(!permission){
        throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
 }

  async update(id: string, data: UpdatePermissionDto): Promise<Permission> {
    try {
      await this.permissionRepository.update(id, data);
      return this.findOne(id);
    } catch (error) {
      if(error.code==='23505'){
        throw new ConflictException(`Ya existe un permiso con el mismo nombre`);
      }
      throw new InternalServerErrorException('Error updating permission');
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    return this.permissionRepository.softDelete(id);
  }
}
