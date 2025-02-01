import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedbacks } from 'src/entities/feedbacks.entity';
import { FeedbacksController } from './feedbacks.controller';

@Module({
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
  imports: [TypeOrmModule.forFeature([Feedbacks])],
})
export class FeedbacksModule {}
