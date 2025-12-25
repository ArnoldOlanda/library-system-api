import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Producto } from '../productos/entities/producto.entity';
import { FindVentasDto } from './dto/find-ventas.dto';
import { MovimientosAlmacenService } from '../movimientos-almacen/movimientos-almacen.service';
import { User } from '../users/entities/user.entity';
import { TipoMovimiento, OrigenMovimiento } from '../movimientos-almacen/entities/movimiento-almacen.entity';

@Injectable()
export class VentasService {
  private readonly logger = new Logger(VentasService.name);

  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly dataSource: DataSource,
    private readonly movimientosAlmacenService: MovimientosAlmacenService,
  ) {}

  async create(createVentaDto: CreateVentaDto, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { clienteId, detalles, fechaVenta, formaPago } = createVentaDto;

      // Validar cliente (opcional)
      let cliente: Cliente | null = null;
      if (clienteId) {
        cliente = await this.clienteRepository.findOne({
          where: { id: clienteId },
        });

        if (!cliente) {
          throw new NotFoundException(`Cliente with id ${clienteId} not found`);
        }
      }

      // Calcular total y validar stock
      let total = 0;
      const detallesVenta: DetalleVenta[] = [];

      for (const detalle of detalles) {
        const producto = await this.productoRepository.findOne({
          where: { id: detalle.productoId },
        });

        if (!producto) {
          throw new NotFoundException(
            `Producto with id ${detalle.productoId} not found`,
          );
        }

        // Validar stock disponible
        if (producto.stock < detalle.cantidad) {
          throw new BadRequestException(
            `Insufficient stock for product ${producto.nombre}. Available: ${producto.stock}, Requested: ${detalle.cantidad}`,
          );
        }

        const subtotal = detalle.cantidad * Number(detalle.precioUnitario);
        total += subtotal;

        // Crear detalle de venta
        const detalleVenta = this.detalleVentaRepository.create({
          producto,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
        });

        detallesVenta.push(detalleVenta);
      }

      // Crear venta
      const venta = this.ventaRepository.create({
        cliente,
        fechaVenta: new Date(fechaVenta),
        total,
        formaPago,
        detalles: detallesVenta,
      });

      const savedVenta = await queryRunner.manager.save(venta);

      // Registrar movimientos de almacén
      for (const detalle of savedVenta.detalles) {
        await this.movimientosAlmacenService.create(
          {
            productoId: detalle.producto.id,
            tipoMovimiento: TipoMovimiento.SALIDA,
            origenMovimiento: OrigenMovimiento.VENTA,
            cantidad: detalle.cantidad,
            referenciaId: savedVenta.id,
            observaciones: `Venta #${savedVenta.id}${savedVenta.cliente ? ` - Cliente: ${savedVenta.cliente.nombre}` : ''}`,
          },
          user,
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();

      return savedVenta;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error creating venta: ${error.message}`, error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error creating venta',
      });
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(findVentasDto: FindVentasDto) {
    const { limit = 10, offset = 0, startDate, endDate } = findVentasDto;

    const queryOptions: any = {
      relations: ['cliente', 'detalles', 'detalles.producto'],
      take: limit,
      skip: offset,
      order: { fechaVenta: 'DESC' },
      where: {},
    };

    if (startDate && endDate) {
      // Ajustar fechas para cubrir el rango completo del día
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      queryOptions.where.fechaVenta = Between(start, end);
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(startDate);
      end.setHours(23, 59, 59, 999);
      queryOptions.where.fechaVenta = Between(start, end);
    }

    const [ventas, total] = await this.ventaRepository.findAndCount(queryOptions);

    return {
      ventas,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['cliente', 'detalles', 'detalles.producto'],
    });

    if (!venta) {
      throw new NotFoundException(`Venta with id ${id} not found`);
    }

    return venta;
  }

  update(_id: string, _updateVentaDto: UpdateVentaDto) {
    throw new InternalServerErrorException({
      success: false,
      message: 'Update venta not implemented for data integrity',
    });
  }

  async remove(id: string, user: User) {
    const venta = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Registrar movimientos de almacén para revertir stock
      for (const detalle of venta.detalles) {
        await this.movimientosAlmacenService.create(
          {
            productoId: detalle.producto.id,
            tipoMovimiento: TipoMovimiento.ENTRADA,
            origenMovimiento: OrigenMovimiento.DEVOLUCION_VENTA,
            cantidad: detalle.cantidad,
            referenciaId: venta.id,
            observaciones: `Anulación de Venta #${venta.id}${venta.cliente ? ` - Cliente: ${venta.cliente.nombre}` : ''}`,
          },
          user,
          queryRunner.manager,
        );
      }

      await queryRunner.manager.remove(venta);
      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Venta deleted successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error deleting venta: ${error.message}`, error.stack);

      throw new InternalServerErrorException({
        success: false,
        message: 'Error deleting venta',
      });
    } finally {
      await queryRunner.release();
    }
  }
}
