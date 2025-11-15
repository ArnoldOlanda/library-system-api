// email.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailVerificationService } from 'src/auth/emailVerification.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {

    constructor(
        private readonly emailVerificationService: EmailVerificationService 
    ) {
        super();
    }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-verification-email':
        return this.handleSendVerificationEmail(job);
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
        
        const messageInfo = await this.emailVerificationService.sendEmailVerification(email, name, activationUrl);
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
