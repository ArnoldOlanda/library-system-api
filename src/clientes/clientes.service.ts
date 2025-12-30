import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { PaginationDto } from '../users/dto/pagination.dto';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepository.create(createClienteDto);
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      this.logger.error(
        `Error creating cliente: ${error.message}`,
        error.stack,
      );

      if (error.code === '23505') {
        throw new ConflictException('Cliente already exists');
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Error creating cliente',
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0, search } = paginationDto;

    const queryBuilder = this.clienteRepository.createQueryBuilder('cliente');

    if (search) {
      queryBuilder.where('cliente.nombre ILIKE :search', { search: `%${search}%` })
        .orWhere('cliente.dni ILIKE :search', { search: `%${search}%` })
        .orWhere('cliente.correo ILIKE :search', { search: `%${search}%` })
        .orderBy('cliente.createdAt', 'DESC');
    }

    if(limit){
      const skip = offset > 0 ? (offset - 1) * limit : 0;
      queryBuilder.skip(skip).take(limit);
    }

    const [clientes, total] = await queryBuilder.getManyAndCount();

    return {
      clientes,
      total,
      ...(limit && {
        limit,
        offset,
        pages: Math.ceil(total / limit)
      }),
    };
  }

  async findOne(id: string) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['ventas'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente with id ${id} not found`);
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    try {
      const cliente = await this.clienteRepository.preload({
        id,
        ...updateClienteDto,
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente with id ${id} not found`);
      }

      return await this.clienteRepository.save(cliente);
    } catch (error) {
      this.logger.error(
        `Error updating cliente: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error updating cliente',
      });
    }
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);

    return {
      success: true,
      message: 'Cliente deleted successfully',
    };
  }
}
