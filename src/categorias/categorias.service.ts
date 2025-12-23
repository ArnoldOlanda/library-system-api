import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { PaginationDto } from '../users/dto/pagination.dto';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name);

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto);
      return this.categoriaRepository.save(categoria);
    } catch (error) {
      this.logger.error(
        `Error creating categoria: ${error.message}`,
        error.stack,
      );

      if (error.code === '23505') {
        throw new ConflictException('Categoria name already exists');
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Error creating categoria',
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const [categorias, total] =
      await this.categoriaRepository.findAndCount({
        take: limit,
        skip: offset - 1,
        order: { createdAt: 'DESC' },
      });

    return {
      categorias,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['productos'],
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria with id ${id} not found`);
    }

    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    try {
      const categoria = await this.categoriaRepository.preload({
        id,
        ...updateCategoriaDto,
      });

      if (!categoria) {
        throw new NotFoundException(`Categoria with id ${id} not found`);
      }

      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      this.logger.error(
        `Error updating categoria: ${error.message}`,
        error.stack,
      );

      if (error.code === '23505') {
        throw new ConflictException('Categoria name already exists');
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error updating categoria',
      });
    }
  }

  async remove(id: string) {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);

    return {
      success: true,
      message: 'Categoria deleted successfully',
    };
  }
}
