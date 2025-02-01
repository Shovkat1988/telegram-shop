import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailingQueue } from 'src/entities/mailing-queue.entity';
import { Repository } from 'typeorm';
import * as TelegramBot from 'node-telegram-bot-api';
import { Users } from 'src/entities/users.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MailingSenderService {
  constructor(
    @InjectRepository(MailingQueue)
    private readonly mailingQueueRepository: Repository<MailingQueue>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  @Cron('* * * * *')
  async handleCron() {
    const mailingQueue = await this.mailingQueueRepository
      .createQueryBuilder('mailing_queue')
      .select([
        'mailing_queue.id as id',
        'mailing_queue.text as text',
        'uploads.url as image_url',
      ])
      .orderBy('created_at', 'ASC')
      .leftJoin('mailing_queue.image_id', 'uploads')
      .getRawMany();

    if (!mailingQueue.length) return;

    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

    for await (const mail of mailingQueue) {
      await this.mailingQueueRepository.delete(mail.id);

      const users = await this.usersRepository
        .createQueryBuilder('users')
        .select(['users.user_id as user_id'])
        .getRawMany();

      const ids = users.map((user) => user.user_id);

      for (let i = 0; i < ids.length / 30; i += 30) {
        const chunk = ids.slice(i, i + 30);

        for await (const id of chunk) {
          try {
            if (mail.text && !mail.image_url) {
              await bot.sendMessage(id, mail.text, {
                parse_mode: 'HTML',
              });
            }

            if (mail.image_url) {
              await bot.sendPhoto(id, `${process.env.URL}${mail.image_url}`, {
                caption: mail.text ? mail.text : null,
                parse_mode: 'HTML',
              });
            }
          } catch {}
        }
      }
    }
  }
}
