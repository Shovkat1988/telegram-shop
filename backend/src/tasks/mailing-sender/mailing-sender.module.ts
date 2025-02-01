import { Module } from '@nestjs/common';
import { MailingSenderService } from './mailing-sender.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingQueue } from 'src/entities/mailing-queue.entity';
import { Users } from 'src/entities/users.entity';

@Module({
  providers: [MailingSenderService],
  imports: [TypeOrmModule.forFeature([MailingQueue, Users])],
})
export class MailingSenderModule {}
