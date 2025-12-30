import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { Producto } from '../productos/entities/producto.entity';
import { PaginationDto } from '../users/dto/pagination.dto';
import { MovimientosAlmacenService } from '../movimientos-almacen/movimientos-almacen.service';
import {
  TipoMovimiento,
  OrigenMovimiento,
} from '../movimientos-almacen/entities/movimiento-almacen.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ComprasService {
  private readonly logger = new Logger(ComprasService.name);

  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    @InjectRepository(DetalleCompra)
    private readonly detalleCompraRepository: Repository<DetalleCompra>,
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly dataSource: DataSource,
    private readonly movimientosAlmacenService: MovimientosAlmacenService,
  ) {}

  async create(createCompraDto: CreateCompraDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { proveedorId, detalles, fechaCompra } = createCompraDto;

      // Validar proveedor
      const proveedor = await this.proveedorRepository.findOne({
        where: { id: proveedorId },
      });

      if (!proveedor) {
        throw new NotFoundException(`Proveedor with id ${proveedorId} not found`);
      }

      // Calcular total
      let total = 0;
      const detallesCompra: DetalleCompra[] = [];

      for (const detalle of detalles) {
        const producto = await this.productoRepository.findOne({
          where: { id: detalle.productoId },
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto with id ${detalle.productoId} not found`,
          );
        }

        const subtotal = detalle.cantidad * Number(detalle.precioUnitario);
        total += subtotal;

        // Crear detalle de compra
        const detalleCompra = this.detalleCompraRepository.create({
          producto,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
        });

        detallesCompra.push(detalleCompra);
      }

      // Crear compra
      const compra = this.compraRepository.create({
        proveedor,
        fechaCompra: new Date(fechaCompra),
        total,
        detalles: detallesCompra,
      });

      const savedCompra = await queryRunner.manager.save(compra);

      // Registrar movimientos de almacén para cada detalle
      for (const detalle of savedCompra.detalles) {
        await this.movimientosAlmacenService.create(
          {
            productoId: detalle.producto.id,
            tipoMovimiento: TipoMovimiento.ENTRADA,
            origenMovimiento: OrigenMovimiento.COMPRA,
            cantidad: detalle.cantidad,
            referenciaId: savedCompra.id,
            observaciones: `Compra #${savedCompra.id} - Proveedor: ${proveedor.nombre}`,
          },
          user,
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedCompra.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error creating compra: ${error.message}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error creating compra',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0, search } = paginationDto;

    const queryBuilder = this.compraRepository.createQueryBuilder('compra')
      .leftJoinAndSelect('compra.proveedor', 'proveedor')
      .leftJoinAndSelect('compra.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto')
      .orderBy('compra.fechaCompra', 'DESC');

    if (search) {
      queryBuilder.where('proveedor.nombre ILIKE :search', { search: `%${search}%` })
        .orWhere('producto.nombre ILIKE :search', { search: `%${search}%` });
    }

    if(limit){
      const skip = offset > 0 ? (offset - 1) * limit : 0;
      queryBuilder.skip(skip).take(limit);
    }

    const [compras, total] = await queryBuilder.getManyAndCount();
    return {
      compras,
      total,
      ...(limit && {
        limit,
        offset,
        pages: Math.ceil(total / limit),
      }),
    };
  }

  async findOne(id: string) {
    const compra = await this.compraRepository.findOne({
      where: { id },
      relations: ['proveedor', 'detalles', 'detalles.producto'],
    });

    if (!compra) {
      throw new NotFoundException(`Compra with id ${id} not found`);
    }

    return compra;
  }

  update(_id: string, _updateCompraDto: UpdateCompraDto) {
    throw new InternalServerErrorException({
      success: false,
      message: 'Update compra not implemented for data integrity',
    });
  }

  async remove(id: string, user: User) {
    const compra = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Registrar movimientos de almacén para revertir stock
      for (const detalle of compra.detalles) {
        await this.movimientosAlmacenService.create(
          {
            productoId: detalle.producto.id,
            tipoMovimiento: TipoMovimiento.SALIDA,
            origenMovimiento: OrigenMovimiento.DEVOLUCION_COMPRA,
            cantidad: detalle.cantidad,
            referenciaId: compra.id,
            observaciones: `Anulación de Compra #${compra.id} - Proveedor: ${compra.proveedor.nombre}`,
          },
          user,
          queryRunner.manager,
        );
      }

      await queryRunner.manager.remove(compra);
      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Compra deleted successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error deleting compra: ${error.message}`, error.stack);

      throw new InternalServerErrorException({
        success: false,
        message: 'Error deleting compra',
      });
    } finally {
      await queryRunner.release();
    }
  }
}
