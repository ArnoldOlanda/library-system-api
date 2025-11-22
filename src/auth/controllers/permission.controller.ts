import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto';
import { Auth } from '../decorators/auth.decorator';
import { Permission } from '../enums/permissions.enum';

@ApiBearerAuth()
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Auth({permissions: [Permission.CREATE_PERMISSION]})
  @Post()
  @ApiResponse({ status: 201, description: 'Permiso creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
  @ApiResponse({ status: 409, description: 'Conflicto. El permiso ya existe.' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  @Auth({permissions: [Permission.READ_PERMISSION]})
  @Get()
  @ApiResponse({ status: 200, description: 'Lista de permisos obtenida correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Auth({permissions: [Permission.READ_PERMISSION]})
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Permiso obtenido correctamente.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionService.findOne(id);
  }

  @Auth({permissions: [Permission.UPDATE_PERMISSION]})
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Permiso actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePermissionDto) {
    return await this.permissionService.update(id, dto);
  }

  @Auth({permissions: [Permission.DELETE_PERMISSION]})
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Permiso eliminado correctamente.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionService.remove(id);
  }
}
