import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'my-secret',
    });
  }

  async validate(payload: JwtPayload) {
    
    //Cargamos el usuario con sus roles
    const user = await this.userRepository.findOne({
      where: { id: payload.id, isActive: true },
      relations: ['roles','roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('Token not valid or user is inactive/deleted');
    }

    return user;
  }
}
