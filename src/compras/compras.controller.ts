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
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { PaginationDto } from '../users/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { Permission } from '../auth/enums/permissions.enum';
import { User as UserEntity } from '../users/entities/user.entity';

@ApiBearerAuth()
@ApiTags('compras')
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  @Auth({ permissions: [Permission.CREATE_COMPRA] })
  @ApiResponse({ status: 201, description: 'Compra registrada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Proveedor o producto no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  create(
    @Body() createCompraDto: CreateCompraDto,
    @GetUser() user: UserEntity,
  ) {
    return this.comprasService.create(createCompraDto, user);
  }

  @Get()
  @Auth({ permissions: [Permission.READ_COMPRA] })
  @ApiResponse({ status: 200, description: 'Lista de compras obtenida correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.comprasService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth({ permissions: [Permission.READ_COMPRA] })
  @ApiResponse({ status: 200, description: 'Compra obtenida correctamente.' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.comprasService.findOne(id);
  }

  @Delete(':id')
  @Auth({ permissions: [Permission.DELETE_COMPRA] })
  @ApiResponse({ status: 200, description: 'Compra eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Compra no encontrada.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: UserEntity,
  ) {
    return this.comprasService.remove(id, user);
  }
}
