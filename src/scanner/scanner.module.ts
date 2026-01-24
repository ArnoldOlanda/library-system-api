import { Module } from '@nestjs/common';
import { ScannerGateway } from './scanner.gateway';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [ProductosModule],
  providers: [ScannerGateway],
  exports: [ScannerGateway],
})
export class ScannerModule {}
