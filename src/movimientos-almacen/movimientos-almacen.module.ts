import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientosAlmacenService } from './movimientos-almacen.service';
import { MovimientosAlmacenController } from './movimientos-almacen.controller';
import { MovimientoAlmacen } from './entities/movimiento-almacen.entity';
import { Producto } from '../productos/entities/producto.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovimientoAlmacen, Producto]),
    AuthModule,
  ],
  controllers: [MovimientosAlmacenController],
  providers: [MovimientosAlmacenService],
  exports: [MovimientosAlmacenService],
})
export class MovimientosAlmacenModule {}
