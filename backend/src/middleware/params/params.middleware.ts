import { Injectable, NestMiddleware } from '@nestjs/common';
import { ParamsService } from './params.service';
import checkHash from 'tgwa-params-checker';
import { UserDataDto } from 'src/dto/user-data.dto';
import * as TelegramBot from 'node-telegram-bot-api';
import Errors from 'src/errors.enum';
import * as dotenv from 'dotenv';

dotenv.config(); // Перезагружаем переменные окружения

@Injectable()
export class ParamsMiddleware implements NestMiddleware {
  constructor(private readonly paramsService: ParamsService) {}

  async use(req: any, res: any, next: () => void) {
    const authorizationToken = req?.headers?.authorization?.slice(7) || '';
    
    // 🔥 Логируем перед проверкой
    console.log("🔍 [DEBUG] Authorization Token:", authorizationToken);
    console.log("🔍 [DEBUG] BOT_TOKEN из process.env:", process.env.BOT_TOKEN);
    console.log("🔍 [DEBUG] AUTHORIZATION_LIFETIME:", process.env.AUTHORIZATION_LIFETIME);

    // ✅ Проверяем, действительно ли `BOT_TOKEN` обновился
    if (!process.env.BOT_TOKEN || process.env.BOT_TOKEN.startsWith('7603396304')) {
      console.error("❌ [ERROR] Обнаружен старый BOT_TOKEN! Проверь .env");
      return res.status(500).json({
        status: false,
        message: "Ошибка сервера: используется старый BOT_TOKEN",
      });
    }

    const isValid = checkHash(
      authorizationToken,
      process.env.BOT_TOKEN,
      +process.env.AUTHORIZATION_LIFETIME || 0,
    );

    if (!isValid) {
      console.error("❌ [ERROR] checkHash() вернул false! Токен не прошел проверку!");
      return res.status(401).json({
        status: false,
        ...Errors.ACCESS_DENIED,
      });
    }

    const userData = JSON.parse(
      decodeURIComponent(authorizationToken)
        .split('&')
        .find((el) => el.includes('user='))
        .slice(5),
    );

    const user: UserDataDto = await this.paramsService.getUser(userData);

    if (user.is_banned) {
      const bot = new TelegramBot(process.env.BOT_TOKEN);

      await bot.sendMessage(
        user.user_id,
        `Доступ к магазину <b>закрыт</b>. Ваш аккаунт заблокирован.`,
        { parse_mode: 'HTML' }
      );

      return res.status(401).json({
        status: false,
        ...Errors.ACCESS_DENIED,
      });
    }

    req.headers = { ...req.headers, user };
    next();
  }
}
