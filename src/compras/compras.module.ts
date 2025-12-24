import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { Producto } from '../productos/entities/producto.entity';
import { AuthModule } from '../auth/auth.module';
import { MovimientosAlmacenModule } from '../movimientos-almacen/movimientos-almacen.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra, DetalleCompra, Proveedor, Producto]),
    AuthModule,
    MovimientosAlmacenModule,
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [TypeOrmModule],
})
export class ComprasModule {}
