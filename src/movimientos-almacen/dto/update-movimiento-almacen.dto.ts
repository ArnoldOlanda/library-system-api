import { PartialType } from '@nestjs/swagger';
import { CreateMovimientoAlmacenDto } from './create-movimiento-almacen.dto';

export class UpdateMovimientoAlmacenDto extends PartialType(
  CreateMovimientoAlmacenDto,
) {}
