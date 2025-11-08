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
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { Auth } from './decorators/auth.decorator';
import { AssignPermissionsDto } from './dto/assignPermissions.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Auth()
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.create(dto);  
    }

    @Auth()
    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @Auth()
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.roleService.findOne(id);
    }

    @Auth()
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
        return this.roleService.update(id, dto);
    }

    @Auth()
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.roleService.remove(id);
    }

    @Auth()
    @Post(':id/permissions')
    async assignPermissions(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: AssignPermissionsDto,
    ) {
        return this.roleService.assignPermissions(id, body.permissionIds);
    }
    
    @Auth()
    @Get(':id/permissions')
    async getPermissions(
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.roleService.getPermissions(id);
    }
}
