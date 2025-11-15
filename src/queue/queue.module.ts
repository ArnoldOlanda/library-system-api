import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './processors/email.processor';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email', // nombre de la cola
    }),
    AuthModule
  ],
  providers: [EmailProcessor],
  exports: [BullModule], // por si quieres inyectar colas en otros módulos
})
export class QueueModule {}
