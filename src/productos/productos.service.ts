import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { PaginationDto } from '../users/dto/pagination.dto';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger(ProductosService.name);

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    try {
      const { categoriaId, ...rest } = createProductoDto;

      const categoria = await this.categoriaRepository.findOne({
        where: { id: categoriaId },
      });

      if (!categoria) {
        throw new NotFoundException(`Categoria with id ${categoriaId} not found`);
      }

      const producto = this.productoRepository.create({
        ...rest,
        categoria,
      });

      return await this.productoRepository.save(producto);
    } catch (error) {
      this.logger.error(
        `Error creating producto: ${error.message}`,
        error.stack,
      );

      if (error.code === '23505') {
        throw new ConflictException('Product code already exists');
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error creating producto',
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const [productos, total] = await this.productoRepository.findAndCount({
      relations: ['categoria'],
      take: limit,
      skip: offset - 1,
      order: { createdAt: 'DESC' },
    });

    return {
      productos,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });

    if (!producto) {
      throw new NotFoundException(`Producto with id ${id} not found`);
    }

    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    try {
      const { categoriaId, ...rest } = updateProductoDto;

      const producto = await this.productoRepository.findOne({
        where: { id },
        relations: ['categoria'],
      });

      if (!producto) {
        throw new NotFoundException(`Producto with id ${id} not found`);
      }

      if (categoriaId) {
        const categoria = await this.categoriaRepository.findOne({
          where: { id: categoriaId },
        });

        if (!categoria) {
          throw new NotFoundException(`Categoria with id ${categoriaId} not found`);
        }

        producto.categoria = categoria;
      }

      Object.assign(producto, rest);

      return await this.productoRepository.save(producto);
    } catch (error) {
      this.logger.error(
        `Error updating producto: ${error.message}`,
        error.stack,
      );

      if (error.code === '23505') {
        throw new ConflictException('Product code already exists');
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error updating producto',
      });
    }
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);

    return {
      success: true,
      message: 'Producto deleted successfully',
    };
  }
}
