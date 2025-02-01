import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailingQueue } from 'src/entities/mailing-queue.entity';
import { Uploads } from 'src/entities/uploads.entity';

@Module({
  controllers: [MailingController],
  providers: [MailingService],
  imports: [TypeOrmModule.forFeature([MailingQueue, Uploads])],
})
export class MailingModule {}
