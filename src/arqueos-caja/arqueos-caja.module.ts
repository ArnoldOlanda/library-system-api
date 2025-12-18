import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArqueosCajaService } from './arqueos-caja.service';
import { ArqueosCajaController } from './arqueos-caja.controller';
import { ArqueoCaja } from './entities/arqueo-caja.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArqueoCaja]), AuthModule],
  controllers: [ArqueosCajaController],
  providers: [ArqueosCajaService],
  exports: [TypeOrmModule],
})
export class ArqueosCajaModule {}
