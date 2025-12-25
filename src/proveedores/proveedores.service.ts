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
    const { limit = 10, offset = 0 } = paginationDto;

    const [proveedores, total] =
      await this.proveedorRepository.findAndCount({
        take: limit,
        skip: offset - 1,
        order: { createdAt: 'DESC' },
      });

    return {
      proveedores,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
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
