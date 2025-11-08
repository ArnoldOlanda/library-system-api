import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../enums/validRoles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './roleProtected.decorator';
import { UserRoleGuard } from '../guard/userRole.guard';
import { PermissionsProtected } from './permissions.decorator';
import { Permission } from '../enums/permissions.enum';
import { PermissionsGuard } from '../guard/permissions.guard';

interface AuthOptions {
    roles?: Role[];
    permissions?: Permission[];
}

export function Auth({ roles = [], permissions = [] }: AuthOptions = {}) {
    return applyDecorators(
        RoleProtected(...roles),
        PermissionsProtected(...permissions),
        UseGuards(AuthGuard('jwt'), UserRoleGuard, PermissionsGuard),
    );
}
