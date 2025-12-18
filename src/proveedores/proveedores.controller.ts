import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PaginationDto } from '../users/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../auth/enums/permissions.enum';

@ApiBearerAuth()
@ApiTags('proveedores')
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  @Auth({ permissions: [Permission.CREATE_PROVEEDOR] })
  @ApiResponse({ status: 201, description: 'Proveedor creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedoresService.create(createProveedorDto);
  }

  @Get()
  @Auth({ permissions: [Permission.READ_PROVEEDOR] })
  @ApiResponse({ status: 200, description: 'Lista de proveedores obtenida correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.proveedoresService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth({ permissions: [Permission.READ_PROVEEDOR] })
  @ApiResponse({ status: 200, description: 'Proveedor obtenido correctamente.' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.proveedoresService.findOne(id);
  }

  @Patch(':id')
  @Auth({ permissions: [Permission.UPDATE_PROVEEDOR] })
  @ApiResponse({ status: 200, description: 'Proveedor actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return this.proveedoresService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  @Auth({ permissions: [Permission.DELETE_PROVEEDOR] })
  @ApiResponse({ status: 200, description: 'Proveedor eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.proveedoresService.remove(id);
  }
}
