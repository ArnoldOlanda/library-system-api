// email.processor.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {

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
        console.log('Job no reconocido:', job.name);
    }
  }

  private async handleSendVerificationEmail(
    job: Job<{ email: string; name: string; activationUrl: string }>,
  ) {
    try {
        const { email, name, activationUrl } = job.data;
        console.log(`Enviando correo de verificación a ${email}`,);
        
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
        console.log(error);
    }
  }

  private async handleSendPasswordResetEmail(
    job: Job<{ email: string; url: string }>,
  ) {
    try {
        const { email, url } = job.data;
        console.log(`Enviando correo de restablecimiento de contraseña a ${email}`,);

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
        console.log(error);
    }
  }

  // Opcional: logs de eventos
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} (${job.name}) completado`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(
      `Job ${job?.id} (${job?.name}) falló: ${err.message}`,
    );
  }
}
