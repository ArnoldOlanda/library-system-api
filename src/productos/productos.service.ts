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
  const { limit, offset = 0, search } = paginationDto;

  const queryBuilder = this.productoRepository
    .createQueryBuilder('producto')
    .leftJoinAndSelect('producto.categoria', 'categoria')
    .orderBy('producto.createdAt', 'DESC');

  if (search) {
    queryBuilder.where('producto.nombre ILIKE :search', { search: `%${search}%` })
      .orWhere('producto.codigo ILIKE :search', { search: `%${search}%` })
      .orWhere('producto.descripcion ILIKE :search', { search: `%${search}%` })
      .orWhere('categoria.nombre ILIKE :search', { search: `%${search}%` });
  }

  // Aplicar paginación solo si limit está definido
  if (limit) {
    const skip = offset > 0 ? (offset - 1) * limit : 0;
    queryBuilder.take(limit).skip(skip);
  }

  const [productos, total] = await queryBuilder.getManyAndCount();

  // Retornar con información de paginación
  return {
    productos,
    total,
    ...(limit && {
      limit,
      offset,
      pages: Math.ceil(total / limit),
    }),
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
