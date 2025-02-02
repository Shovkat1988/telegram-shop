import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService {
  private bot: TelegramBot;

  constructor() {
    this.start();
  }

  async start() {
    if (!process.env.BOT_TOKEN) {
      console.error("❌ [ERROR] BOT_TOKEN отсутствует в .env!");
      return;
    }

    if (!process.env.START_MESSAGE_FILE_ID) {
      console.error("❌ [ERROR] START_MESSAGE_FILE_ID отсутствует в .env!");
      return;
    }

    if (!process.env.MINI_APP_STATIC_URL) {
      console.error("❌ [ERROR] MINI_APP_STATIC_URL отсутствует в .env!");
      return;
    }

    this.bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    this.bot.on('message', async (msg) => {
      try {
        if (msg.from.is_bot || msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
          return;
        }

        console.log(`📩 Получено сообщение от: ${msg.from.first_name} (ID: ${msg.from.id})`);

        // Проверяем существование файла перед отправкой
        const fileId = process.env.START_MESSAGE_FILE_ID;
        if (!fileId) {
          console.error("❌ [ERROR] START_MESSAGE_FILE_ID пустой!");
          return;
        }

        // Проверяем URL мини-приложения
        const miniAppUrl = process.env.MINI_APP_STATIC_URL;
        if (!miniAppUrl) {
          console.error("❌ [ERROR] MINI_APP_STATIC_URL пустой!");
          return;
        }

        await this.bot.sendDocument(msg.chat.id, fileId, {
          caption: `${msg.from.first_name}, Приветствуем тебя в нашем боте по доставке вкуснейшего судуха. 🌯🥤🌮\n\nКак оформить заказ?\n\n☑️ Перейди на вкладку «Перейти к заказу»\n☑️ Выбери те блюда, которые хочешь заказать\n☑️ Укажи количество и адрес доставки\n☑️ Определись со способом оплаты \n\n🔺заказы принимаем ежедневно\n🔸минимальная сумма заказа — 500₽\n🔺время доставки — от 30 до 60 минут\n🔸стоимость доставки — 300₽\n\nИтак, нажмите «Перейти к заказу»`,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Перейти к заказу',
                  web_app: {
                    url: miniAppUrl,
                  },
                },
              ],
            ],
          },
        });

        console.log(`✅ Успешно отправлено сообщение пользователю ${msg.from.first_name}`);

      } catch (error) {
        console.error("❌ [ERROR] Ошибка при обработке сообщения:", error.message);
      }
    });
  }
}
