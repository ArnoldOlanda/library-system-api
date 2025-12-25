import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Venta } from '../ventas/entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { DetalleVenta } from '../ventas/entities/detalle-venta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, Producto, Cliente, DetalleVenta]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
