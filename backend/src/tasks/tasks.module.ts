import { Module } from '@nestjs/common';
import { MailingSenderModule } from './mailing-sender/mailing-sender.module';

@Module({
  imports: [MailingSenderModule],
})
export class TasksModule {}
