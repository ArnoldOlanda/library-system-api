import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { FindVentasDto } from './dto/find-ventas.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../auth/enums/permissions.enum';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @Auth({ permissions: [Permission.CREATE_VENTA] })
  @ApiResponse({ status: 201, description: 'Venta registrada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o stock insuficiente.' })
  @ApiResponse({ status: 404, description: 'Cliente o producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  create(
    @Body() createVentaDto: CreateVentaDto,
    @GetUser() user: User
  ) {
    return this.ventasService.create(createVentaDto, user);
  }

  @Get()
  @Auth({ permissions: [Permission.READ_VENTA] })
  @ApiResponse({ status: 200, description: 'Lista de ventas obtenida correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  findAll(@Query() findVentasDto: FindVentasDto) {
    return this.ventasService.findAll(findVentasDto);
  }

  @Get(':id')
  @Auth({ permissions: [Permission.READ_VENTA] })
  @ApiResponse({ status: 200, description: 'Venta obtenida correctamente.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ventasService.findOne(id);
  }

  @Delete(':id')
  @Auth({ permissions: [Permission.DELETE_VENTA] })
  @ApiResponse({ status: 200, description: 'Venta eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.ventasService.remove(id, user);
  }
}
