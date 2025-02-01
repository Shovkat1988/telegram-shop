import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService {
  constructor() {
    this.start();
  }

  async start() {
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    bot.on('message', async (msg) => {
      if (
        msg.from.is_bot ||
        msg.chat.type === 'group' ||
        msg.chat.type === 'supergroup'
      )
        return;

      await bot.sendDocument(msg.chat.id, process.env.START_MESSAGE_FILE_ID, {
        caption: `${msg.from.first_name}, Приветствуем тебя в нашем боте по доставке вкуснейшего судуха. 🌯🥤🌮\n\nКак оформить заказ?\n\n☑️ Перейди на вкладку «Перейти к заказу»\n☑️ Выбери те блюда, которые хочешь заказать\n☑️ Укажи количество и адрес доставки\n☑️ Определись со способом оплаты \n\n🔺заказы принимаем ежедневно\n🔸минимальная сумма заказа — 500₽\n🔺время доставки — от 30 до 60 минут\n🔸стоимость доставки — 300₽\n\nИтак, нажмите «Перейти к заказу»`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Перейти к заказу',
                web_app: {
                  url: process.env.MINI_APP_STATIC_URL,
                },
              },
            ],
          ],
        },
      });
    });
  }
}
