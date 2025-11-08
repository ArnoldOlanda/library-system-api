import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/validRoles.enum';

export const META_ROLE = 'role'

export const RoleProtected = (...args: Role[]) => {
    return SetMetadata(META_ROLE, args)
};