import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedbacks } from 'src/entities/feedbacks.entity';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [TypeOrmModule.forFeature([Feedbacks])],
})
export class FeedbackModule {}
