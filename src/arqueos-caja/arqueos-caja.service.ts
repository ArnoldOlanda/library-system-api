import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArqueoCajaDto } from './dto/create-arqueo-caja.dto';
import { UpdateArqueoCajaDto } from './dto/update-arqueo-caja.dto';
import { ArqueoCaja } from './entities/arqueo-caja.entity';
import { PaginationDto } from '../users/dto/pagination.dto';

@Injectable()
export class ArqueosCajaService {
  private readonly logger = new Logger(ArqueosCajaService.name);

  constructor(
    @InjectRepository(ArqueoCaja)
    private readonly arqueoCajaRepository: Repository<ArqueoCaja>,
  ) {}

  async create(createArqueoCajaDto: CreateArqueoCajaDto) {
    try {
      const arqueo = this.arqueoCajaRepository.create({
        ...createArqueoCajaDto,
        fechaArqueo: new Date(createArqueoCajaDto.fechaArqueo),
      });
      return await this.arqueoCajaRepository.save(arqueo);
    } catch (error) {
      this.logger.error(
        `Error creating arqueo caja: ${error.message}`,
        error.stack,
      );

      if (error.code === '23505') {
        throw new ConflictException('Arqueo caja already exists');
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Error creating arqueo caja',
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const [arqueos, total] = await this.arqueoCajaRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { fechaArqueo: 'DESC' },
    });

    return {
      arqueos,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const arqueo = await this.arqueoCajaRepository.findOne({
      where: { id },
    });

    if (!arqueo) {
      throw new NotFoundException(`Arqueo caja with id ${id} not found`);
    }

    return arqueo;
  }

  async update(id: string, updateArqueoCajaDto: UpdateArqueoCajaDto) {
    try {
      const arqueo = await this.arqueoCajaRepository.findOne({
        where: { id },
      });

      if (!arqueo) {
        throw new NotFoundException(`Arqueo caja with id ${id} not found`);
      }

      Object.assign(arqueo, {
        ...updateArqueoCajaDto,
        fechaArqueo: updateArqueoCajaDto.fechaArqueo
          ? new Date(updateArqueoCajaDto.fechaArqueo)
          : arqueo.fechaArqueo,
      });

      return await this.arqueoCajaRepository.save(arqueo);
    } catch (error) {
      this.logger.error(
        `Error updating arqueo caja: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error updating arqueo caja',
      });
    }
  }

  async remove(id: string) {
    const arqueo = await this.findOne(id);
    await this.arqueoCajaRepository.remove(arqueo);

    return {
      success: true,
      message: 'Arqueo caja deleted successfully',
    };
  }
}
