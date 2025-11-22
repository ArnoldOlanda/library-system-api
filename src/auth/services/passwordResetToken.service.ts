import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Queue } from 'bullmq';
import { PasswordResetToken } from '../entities/passwordResetToken.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectQueue('email')
    private readonly emailQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async forgotPassword(user: User) {
    // Invalidar tokens anteriores del usuario
    await this.passwordResetTokenRepository.update(
      { userId: user.id, isUsed: false },
      { isUsed: true },
    );

    // Generar nuevo token único (UUID)
    const tokenId = crypto.randomUUID();

    // Crear fecha de expiración (1 hora desde ahora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const resetToken = this.passwordResetTokenRepository.create({
      id: tokenId,
      userId: user.id,
      expiresAt,
      isUsed: false,
    });

    await this.passwordResetTokenRepository.save(resetToken);

    // Enviar email con el enlace de restablecimiento de contraseña
    const url = `${this.configService.get<string>(
        'FRONTEND_URL',
      )}/auth/reset-password?token=${tokenId}`;

    await this.queuePasswordResetEmail(user.email, url);
  }

  async resetPassword(token: string):Promise<User>{
    const resetToken = await this.findTokenAndValidate(token);

    // Marcar el token como usado
    resetToken.isUsed = true;
    await this.passwordResetTokenRepository.save(resetToken);
    return resetToken.user;
  }
  
  private async queuePasswordResetEmail(email: string, url: string) {
    await this.emailQueue.add(
      'send-password-reset-email',
      {email, url},
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 10000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

   async findTokenAndValidate(token: string) {
      // Buscar el token en la base de datos
      const resetToken = await this.passwordResetTokenRepository.findOne({
        where: { id: token },
        relations: ['user'],
      });
  
      if (!resetToken) {
        throw new NotFoundException('Token de reseteo no encontrado');
      }
  
      // Verificar si el token es válido (no usado y no expirado)
      if (!resetToken.isValid()) {
        let message = 'El token de reseteo no es válido';
  
        if (resetToken.isUsed) {
          message = 'Este token ya ha sido utilizado';
        } else if (resetToken.isExpired()) {
          message = 'El token ha expirado. Por favor, solicita uno nuevo';
        }
  
        throw new BadRequestException(message);
      }
  
      return resetToken;
    }
}
