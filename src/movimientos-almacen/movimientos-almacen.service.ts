import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateMovimientoAlmacenDto } from './dto/create-movimiento-almacen.dto';
import { UpdateMovimientoAlmacenDto } from './dto/update-movimiento-almacen.dto';
import { QueryMovimientoAlmacenDto } from './dto/query-movimiento-almacen.dto';
import {
  MovimientoAlmacen,
  TipoMovimiento,
} from './entities/movimiento-almacen.entity';
import { Producto } from '../productos/entities/producto.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MovimientosAlmacenService {
  constructor(
    @InjectRepository(MovimientoAlmacen)
    private readonly movimientoRepository: Repository<MovimientoAlmacen>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(
    createMovimientoAlmacenDto: CreateMovimientoAlmacenDto,
    user: User,
    manager?: EntityManager,
  ) {
    const { productoId, tipoMovimiento, cantidad, ...rest } =
      createMovimientoAlmacenDto;

    const entityManager = manager || this.productoRepository.manager;

    // Buscar el producto
    const producto = await entityManager.findOne(Producto, {
      where: { id: productoId },
    });

    if (!producto) {
      throw new NotFoundException(
        `Producto con ID ${productoId} no encontrado`,
      );
    }

    const stockAnterior = producto.stock;
    let stockNuevo: number;

    // Calcular nuevo stock según tipo de movimiento
    if (
      tipoMovimiento === TipoMovimiento.ENTRADA ||
      tipoMovimiento === TipoMovimiento.AJUSTE_ENTRADA
    ) {
      stockNuevo = stockAnterior + cantidad;
    } else if (
      tipoMovimiento === TipoMovimiento.SALIDA ||
      tipoMovimiento === TipoMovimiento.AJUSTE_SALIDA
    ) {
      stockNuevo = stockAnterior - cantidad;

      if (stockNuevo < 0) {
        throw new BadRequestException(
          `Stock insuficiente. Stock actual: ${stockAnterior}, cantidad solicitada: ${cantidad}`,
        );
      }
    } else {
      throw new BadRequestException('Tipo de movimiento no válido');
    }

    // Actualizar stock del producto
    producto.stock = stockNuevo;
    await entityManager.save(Producto, producto);

    // Crear el movimiento
    const movimiento = entityManager.create(MovimientoAlmacen, {
      ...rest,
      producto,
      tipoMovimiento,
      cantidad,
      stockAnterior,
      stockNuevo,
      usuario: user,
      fechaMovimiento: new Date(),
    });

    const savedMovimiento = await entityManager.save(MovimientoAlmacen, movimiento);

    return savedMovimiento;
  }

  async findAll(queryDto: QueryMovimientoAlmacenDto) {
    const {
      limit = 10,
      offset = 0,
      productoId,
      tipoMovimiento,
      origenMovimiento,
      referenciaId,
    } = queryDto;

    const queryBuilder = this.movimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.producto', 'producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('movimiento.usuario', 'usuario')
      .orderBy('movimiento.fechaMovimiento', 'DESC');

    if (productoId) {
      queryBuilder.andWhere('producto.id = :productoId', { productoId });
    }

    if (tipoMovimiento) {
      queryBuilder.andWhere('movimiento.tipoMovimiento = :tipoMovimiento', {
        tipoMovimiento,
      });
    }

    if (origenMovimiento) {
      queryBuilder.andWhere('movimiento.origenMovimiento = :origenMovimiento', {
        origenMovimiento,
      });
    }

    if (referenciaId) {
      queryBuilder.andWhere('movimiento.referenciaId = :referenciaId', {
        referenciaId,
      });
    }

    const [movimientos, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      movimientos,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
    const movimiento = await this.movimientoRepository.findOne({
      where: { id },
      relations: ['producto', 'producto.categoria', 'usuario'],
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    return movimiento;
  }

  async findByProducto(productoId: string, queryDto: QueryMovimientoAlmacenDto) {
    return this.findAll({ ...queryDto, productoId });
  }

  async findByReferencia(
    referenciaId: string,
    queryDto: QueryMovimientoAlmacenDto,
  ) {
    return this.findAll({ ...queryDto, referenciaId });
  }

  async update(id: string, updateMovimientoAlmacenDto: UpdateMovimientoAlmacenDto) {
    throw new BadRequestException(
      'No se permite actualizar movimientos de almacén. Solo se pueden crear y consultar.',
    );
  }

  async remove(id: string) {
    throw new BadRequestException(
      'No se permite eliminar movimientos de almacén. Son registros de auditoría.',
    );
  }
}

