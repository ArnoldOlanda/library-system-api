import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { META_ROLE } from '../decorators/roleProtected.decorator';
import { isErrored } from 'stream';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles:string[] = this.reflector.get<string[]>(META_ROLE, context.getHandler());

    if(!validRoles) return true;
    if(validRoles.length === 0) return true;
    
    //Los roles ya vienen en el request gracias al AuthGuard de JWT
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    
    // Verifica si el usuario tiene al menos uno de los roles válidos
    const userRoles = Array.isArray(user.roles) ? user.roles.map(r => r.name) : [];
    const hasValidRole = userRoles.some(role => validRoles.includes(role));
    if (!hasValidRole) {
      throw new ForbiddenException('Esta ruta solo es accesible para usuarios con los siguientes roles: ' + validRoles.join(', '));
    }
    return true;
  }
}