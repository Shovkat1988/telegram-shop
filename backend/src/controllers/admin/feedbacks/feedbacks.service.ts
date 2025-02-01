import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { Feedbacks } from 'src/entities/feedbacks.entity';
import { Repository } from 'typeorm';
import { AdminFeedbacksData } from './dto/feedbacks-data.dto';
import { AdminFeedbacksBody } from './dto/feedbacks-body.dto';
import { UserDataDto } from 'src/dto/user-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedbacks)
    private readonly feedbacksRepository: Repository<Feedbacks>,
  ) {}

  async getFeedbacks(query: GetDataDto): Promise<AdminFeedbacksData[]> {
    const feedbacks = await this.feedbacksRepository
      .createQueryBuilder('feedbacks')
      .select([
        'feedbacks.id as id',
        'feedbacks.message as message',
        'feedbacks.created_at as created_at',
      ])
      .where('feedbacks.is_replied = :is_replied', { is_replied: false })
      .offset(query?.offset || 0)
      .limit(query?.limit || 25)
      .orderBy('feedbacks.created_at', 'ASC')
      .getRawMany();

    return feedbacks;
  }

  async answerFeedback(
    user: UserDataDto,
    feedbackId: number,
    body: AdminFeedbacksBody,
  ): Promise<boolean> {
    if (isNaN(feedbackId)) errorGenerator(Errors.BAD_REQUEST);

    const findFeedback = await this.feedbacksRepository
      .createQueryBuilder('feedbacks')
      .select(['feedbacks.id as id', 'users.user_id as user_id'])
      .innerJoin('feedbacks.created_by', 'users')
      .where('feedbacks.id = :id', { id: feedbackId })
      .andWhere('feedbacks.replied_by IS NULL')
      .getRawOne();

    if (!findFeedback) errorGenerator(Errors.NOT_FOUND);

    await this.feedbacksRepository
      .createQueryBuilder()
      .update(Feedbacks)
      .set({
        reply: body.message,
        replied_by: user.id,
        is_replied: true,
      })
      .where('id = :id', { id: feedbackId })
      .execute();

    try {
      const bot = new TelegramBot(process.env.BOT_TOKEN);

      await bot.sendMessage(
        user.user_id,
        `💬 Ваше обращение было <b>рассмотрено</b>:\n\n${body.message}`,
        {
          parse_mode: 'HTML',
        },
      );
    } catch {}

    return true;
  }
}
