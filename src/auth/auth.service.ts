import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { verifyPassword } from 'src/utils';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(res: Response, data: LoginDto) {
    try {
      const user = await this.userRepository.findOneBy({ email: data.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const checkPassword = verifyPassword(data.password, user.password);
      if (!checkPassword)
        throw new UnauthorizedException('Invalid credentials');

      const payload: JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = this.generateToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);

      // Set refresh token cookie http-only
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      this.logger.error('Error during login', error);
      throw new InternalServerErrorException('Error during login');
    }
  }

  private generateToken(payload: { id: string }) {
    return this.jwtService.sign(payload);
  }

  async refreshToken(refresh_token: string) {
    try {
      const refreshSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
      const data = await this.jwtService.verifyAsync(refresh_token, {
        secret: refreshSecret,
      });
      this.logger.log('Refresh token verificado');

      const { exp, iat, ...payload } = data;
      const newAccessToken = await this.jwtService.signAsync(payload);

      return { token: newAccessToken };
    } catch (error) {
      this.logger.error('Error al verificar el token', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateRefreshToken(payload: any) {
    const refreshSecret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
    return this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });
  }
}
