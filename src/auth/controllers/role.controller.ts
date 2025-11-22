import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseUUIDPipe,
    Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { Auth } from '../decorators/auth.decorator';
import { AssignPermissionsDto } from '../dto/assignPermissions.dto';
import { Permission } from '../enums/permissions.enum';

@ApiBearerAuth()
@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Auth({permissions: [Permission.CREATE_ROLE]})
    @Post()
    @ApiResponse({ status: 201, description: 'Rol creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
    @ApiResponse({ status: 409, description: 'Conflicto. El rol ya existe.' })
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.create(dto);  
    }

    @Auth({permissions: [Permission.READ_ROLE]})
    @Get()
    @ApiResponse({ status: 200, description: 'Lista de roles obtenida correctamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
    findAll() {
        return this.roleService.findAll();
    }

    @Auth({permissions: [Permission.READ_ROLE]})
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Rol obtenido correctamente.' })
    @ApiResponse({ status: 400, description: 'ID inválido.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.roleService.findOne(id);
    }

    @Auth({permissions: [Permission.UPDATE_ROLE]})
    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Rol actualizado correctamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
        return this.roleService.update(id, dto);
    }

    @Auth({permissions: [Permission.DELETE_ROLE]})
    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Rol eliminado correctamente.' })
    @ApiResponse({ status: 400, description: 'ID inválido.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.roleService.remove(id);
    }

    @Auth({permissions: [Permission.UPDATE_ROLE]})
    @Post(':id/permissions')
    @ApiResponse({ status: 200, description: 'Permisos asignados correctamente al rol.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
    @ApiResponse({ status: 404, description: 'Rol o permisos no encontrados.' })
    async assignPermissions(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: AssignPermissionsDto,
    ) {
        return this.roleService.assignPermissions(id, body.permissionIds);
    }

    @Auth({permissions: [Permission.UPDATE_ROLE]})
    @Delete(':id/permissions')
    @ApiResponse({ status: 200, description: 'Permisos removidos correctamente del rol.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
    @ApiResponse({ status: 404, description: 'Rol o permisos no encontrados.' })
    async removePermissions(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: AssignPermissionsDto,
    ) {
        return this.roleService.removePermissions(id, body.permissionIds);
    }
    
    @Auth({permissions: [Permission.READ_ROLE]})
    @Get(':id/permissions')
    @ApiResponse({ status: 200, description: 'Permisos del rol obtenidos correctamente.' })
    @ApiResponse({ status: 400, description: 'ID inválido.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Sin permisos suficientes.' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
    async getPermissions(
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.roleService.getPermissions(id);
    }
}
