import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Producto } from '../productos/entities/producto.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { Compra } from '../compras/entities/compra.entity';
import { DetalleVenta } from '../ventas/entities/detalle-venta.entity';
import { DetalleCompra } from '../compras/entities/detalle-compra.entity';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      Venta,
      Compra,
      DetalleVenta,
      DetalleCompra,
    ]),
    PrinterModule
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}
