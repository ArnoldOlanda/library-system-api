// email.processor.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('email')
export class EmailProcessor extends WorkerHost {
    private readonly logger = new Logger(EmailProcessor.name);

    constructor(private readonly mailerService: MailerService) {
        super();
    }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-verification-email':
        return this.handleSendVerificationEmail(job);
      case 'send-password-reset-email':
        return this.handleSendPasswordResetEmail(job);
      default:
        this.logger.warn(`Job no reconocido: ${job.name}`);
    }
  }

  private async handleSendVerificationEmail(
    job: Job<{ email: string; name: string; activationUrl: string }>,
  ) {
    try {
        const { email, name, activationUrl } = job.data;
        this.logger.log(`Enviando correo de verificación a ${email}`);
        
        const messageInfo = await this.mailerService.sendMail({
            to: email,
            from: '"My App" <no-reply@myapp.com>',
            subject: 'Activa tu cuenta',
            template: 'activation',
            context: {
                name,
                activationUrl,
            },
        });
        return { ok: true , info: messageInfo };
    } catch (error) {
        this.logger.error(`Error enviando correo de verificación: ${error.message}`, error.stack);
    }
  }

  private async handleSendPasswordResetEmail(
    job: Job<{ email: string; url: string }>,
  ) {
    try {
        const { email, url } = job.data;
        this.logger.log(`Enviando correo de restablecimiento de contraseña a ${email}`);

        const messageInfo = await this.mailerService.sendMail({
          to: email,
          from: '"my app" <my-app@gmail.com>',
          subject: 'Recuperación de contraseña',
          template: 'forgotPassword',
          context: {
            email,
            url,
          },
        });

        return { ok: true , info: messageInfo };
    } catch (error) {
        this.logger.error(`Error enviando correo de reseteo: ${error.message}`, error.stack);
    }
  }

  // Opcional: logs de eventos
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Job ${job.id} (${job.name}) completado`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(
      `Job ${job?.id} (${job?.name}) falló: ${err.message}`,
      err.stack,
    );
  }
}
