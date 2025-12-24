import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MovimientosAlmacenService } from './movimientos-almacen.service';
import { CreateMovimientoAlmacenDto } from './dto/create-movimiento-almacen.dto';
import { QueryMovimientoAlmacenDto } from './dto/query-movimiento-almacen.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../auth/enums/permissions.enum';
import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/user.decorator';

@ApiBearerAuth()
@ApiTags('movimientos-almacen')
@Controller('movimientos-almacen')
export class MovimientosAlmacenController {
  constructor(
    private readonly movimientosAlmacenService: MovimientosAlmacenService,
  ) {}

  @Post()
  @Auth({ permissions: [Permission.CREATE_PRODUCTO] })
  @ApiResponse({
    status: 201,
    description: 'Movimiento de almacén registrado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  create(
    @Body() createMovimientoAlmacenDto: CreateMovimientoAlmacenDto,
    @GetUser() user: User,
  ) {
    return this.movimientosAlmacenService.create(
      createMovimientoAlmacenDto,
      user,
    );
  }

  @Get()
  @Auth({ permissions: [Permission.READ_PRODUCTO] })
  @ApiResponse({
    status: 200,
    description: 'Lista de movimientos de almacén obtenida correctamente.',
  })
  findAll(@Query() queryDto: QueryMovimientoAlmacenDto) {
    return this.movimientosAlmacenService.findAll(queryDto);
  }

  @Get('producto/:productoId')
  @Auth({ permissions: [Permission.READ_PRODUCTO] })
  @ApiResponse({
    status: 200,
    description: 'Movimientos del producto obtenidos correctamente.',
  })
  findByProducto(
    @Param('productoId', ParseUUIDPipe) productoId: string,
    @Query() queryDto: QueryMovimientoAlmacenDto,
  ) {
    return this.movimientosAlmacenService.findByProducto(productoId, queryDto);
  }

  @Get('referencia/:referenciaId')
  @Auth({ permissions: [Permission.READ_PRODUCTO] })
  @ApiResponse({
    status: 200,
    description: 'Movimientos de la referencia obtenidos correctamente.',
  })
  findByReferencia(
    @Param('referenciaId', ParseUUIDPipe) referenciaId: string,
    @Query() queryDto: QueryMovimientoAlmacenDto,
  ) {
    return this.movimientosAlmacenService.findByReferencia(
      referenciaId,
      queryDto,
    );
  }

  @Get(':id')
  @Auth({ permissions: [Permission.READ_PRODUCTO] })
  @ApiResponse({
    status: 200,
    description: 'Movimiento de almacén obtenido correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.movimientosAlmacenService.findOne(id);
  }
}

