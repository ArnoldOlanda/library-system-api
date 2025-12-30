import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Proveedor } from './entities/proveedor.entity';
import { PaginationDto } from '../users/dto/pagination.dto';

@Injectable()
export class ProveedoresService {
  private readonly logger = new Logger(ProveedoresService.name);

  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto) {
    try {
      const proveedor = this.proveedorRepository.create(createProveedorDto);
      return await this.proveedorRepository.save(proveedor);
    } catch (error) {
      this.logger.error(
        `Error creating proveedor: ${error.message}`,
        error.stack,
      );

      if (error.code === '23505') {
        throw new ConflictException('Proveedor already exists');
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Error creating proveedor',
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0, search } = paginationDto;

    const queryBuilder = this.proveedorRepository.createQueryBuilder('proveedor');

    if (search) {
      queryBuilder.where('proveedor.nombre ILIKE :search', { search: `%${search}%` })
        .orWhere('proveedor.contacto ILIKE :search', { search: `%${search}%` })
        .orWhere('proveedor.correo ILIKE :search', { search: `%${search}%` })
        .orderBy('proveedor.createdAt', 'DESC');
    }

    if(limit){
      const skip = offset > 0 ? (offset - 1) * limit : 0;
      queryBuilder.skip(skip).take(limit);
    }

    const [proveedores, total] = await queryBuilder.getManyAndCount();

    return {
      proveedores,
      total,
      ...(limit && {
        limit,
        offset,
        pages: Math.ceil(total / limit),
      }),
    };
  }

  async findOne(id: string) {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id },
      relations: ['compras'],
    });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor with id ${id} not found`);
    }

    return proveedor;
  }

  async update(id: string, updateProveedorDto: UpdateProveedorDto) {
    try {
      const proveedor = await this.proveedorRepository.preload({
        id,
        ...updateProveedorDto,
      });

      if (!proveedor) {
        throw new NotFoundException(`Proveedor with id ${id} not found`);
      }

      return await this.proveedorRepository.save(proveedor);
    } catch (error) {
      this.logger.error(
        `Error updating proveedor: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating proveedor');
    }
  }

  async remove(id: string) {
    const proveedor = await this.findOne(id);

    if(!proveedor){
      throw new NotFoundException(`Proveedor with id ${id} not found`);
    }

    await this.proveedorRepository.softRemove(proveedor);

    return {
      message: 'Proveedor deleted successfully',
    };
  }
}
