import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRole } from '../enums/validRoles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './roleProtected.decorator';
import { UserRoleGuard } from '../guard/userRole.guard';

export function Auth(...roles: ValidRole[]) {  
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}