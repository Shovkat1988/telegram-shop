import { Injectable } from '@nestjs/common';
import { FeedbackBody } from './dto/feedback-body.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedbacks } from 'src/entities/feedbacks.entity';
import { Repository } from 'typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedbacks)
    private readonly feedbacksRepository: Repository<Feedbacks>,
  ) {}

  async sendFeedback(user: UserDataDto, body: FeedbackBody): Promise<boolean> {
    const findDuplicate = await this.feedbacksRepository.findOne({
      where: { created_by: user.id, message: body.message },
    });

    if (findDuplicate) errorGenerator(Errors.ALREADY_EXISTS);

    await this.feedbacksRepository
      .createQueryBuilder()
      .insert()
      .into(Feedbacks)
      .values({
        created_by: user.id,
        message: body.message,
        created_at: getCurrentTimestamp(),
      })
      .execute();

    const bot = new TelegramBot(process.env.BOT_TOKEN);

    await bot.sendMessage(
      process.env.ADMIN_GROUPS_CHAT,
      `💬 Новый запрос на обратную связь!\n
<b>🆔 Имя отправителя:</b> ${user?.first_name ? `${user.first_name} ` : ``}${
        user?.last_name ? `${user.last_name} ` : ``
      } ${user?.username ? `@${user.username} ` : ' '}<i>(${user.user_id})</i>
<b>💬 Вопрос:</b> ${body.message}`,
      {
        parse_mode: 'HTML',
      },
    );

    return true;
  }
}
