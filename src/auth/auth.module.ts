import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordResetToken } from './entities/passwordResetToken.entity';
import { EmailVerification } from './entities/emailVerification.entity';
import { EmailVerificationService } from './services/emailVerification.service';
import { BullModule } from '@nestjs/bullmq';
import { PasswordResetTokenService } from './services/passwordResetToken.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      PasswordResetToken,
      EmailVerification,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecret',
        signOptions: { expiresIn: '8h' },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [AuthController, RoleController, PermissionController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    RoleService,
    PermissionService,
    EmailVerificationService,
    PasswordResetTokenService,
  ],
  exports: [JwtStrategy, EmailVerificationService],
})
export class AuthModule {}
