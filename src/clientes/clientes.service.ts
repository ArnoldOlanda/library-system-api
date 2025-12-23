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
    const { limit = 10, offset = 0 } = paginationDto;

    const [clientes, total] = await this.clienteRepository.findAndCount({
      take: limit,
      skip: offset - 1,
      order: { createdAt: 'DESC' },
    });

    return {
      clientes,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
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
