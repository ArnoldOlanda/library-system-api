import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY,context.getHandler());

    if (!requiredPermissions) {
      return true;
    }

    if(requiredPermissions.length === 0){
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user as User & { permissions: string[] };

    // Recoger permisos del usuario
    const userPermissions = user.roles.flatMap(role => role.permissions.map(p => p.name));
    
    if(!userPermissions.some(permission => requiredPermissions.includes(permission))){
      throw new ForbiddenException('You do not have the necessary permissions to access this resource.');
    }

    return true;
  }
}