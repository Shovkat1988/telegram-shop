import { Injectable, NestMiddleware } from '@nestjs/common';
import { ParamsService } from './params.service';
import checkHash from 'tgwa-params-checker';
import { UserDataDto } from 'src/dto/user-data.dto';
import * as TelegramBot from 'node-telegram-bot-api';
import Errors from 'src/errors.enum';
import * as dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные окружения

@Injectable()
export class ParamsMiddleware implements NestMiddleware {
  constructor(private readonly paramsService: ParamsService) {}

  async use(req: any, res: any, next: () => void) {
    const authorizationToken = req?.headers?.authorization?.slice(7) || '';

    // 🔥 Логирование перед проверкой
    console.log("🔍 [DEBUG] Authorization Token:", authorizationToken);
    console.log("🔍 [DEBUG] BOT_TOKEN из process.env:", process.env.BOT_TOKEN);
    console.log("🔍 [DEBUG] AUTHORIZATION_LIFETIME:", process.env.AUTHORIZATION_LIFETIME);

    // ✅ Проверяем, корректно ли загружен BOT_TOKEN
    if (!process.env.BOT_TOKEN || process.env.BOT_TOKEN.length < 40) {
      console.error("❌ [ERROR] BOT_TOKEN отсутствует или некорректный! Проверь .env");
      return res.status(500).json({
        status: false,
        message: "Ошибка сервера: BOT_TOKEN отсутствует или некорректный",
      });
    }

    // ✅ Проверяем, есть ли authorizationToken
    if (!authorizationToken) {
      console.error("❌ [ERROR] Authorization Token отсутствует!");
      return res.status(401).json({
        status: false,
        message: "Ошибка авторизации: Authorization Token отсутствует",
      });
    }

    // 🔄 Проверяем авторизационные параметры
    try {
      const isValid = checkHash(
        authorizationToken,
        process.env.BOT_TOKEN,
        +process.env.AUTHORIZATION_LIFETIME || 0
      );

      if (!isValid) {
        console.error("❌ [ERROR] checkHash() вернул false! Токен не прошел проверку!");
        return res.status(401).json({
          status: false,
          message: "Ошибка авторизации: Неверный токен",
        });
      }

      // ✅ Декодируем и проверяем userData
      const userDataRaw = decodeURIComponent(authorizationToken)
        .split('&')
        .find((el) => el.includes('user='));

      if (!userDataRaw) {
        console.error("❌ [ERROR] userData отсутствует в Authorization Token!");
        return res.status(401).json({
          status: false,
          message: "Ошибка авторизации: Данные пользователя не найдены",
        });
      }

      const userData = JSON.parse(userDataRaw.slice(5));
      console.log("✅ [INFO] User Data:", userData);

      const user: UserDataDto = await this.paramsService.getUser(userData);

      if (!user) {
        console.error("❌ [ERROR] Пользователь не найден в базе данных!");
        return res.status(401).json({
          status: false,
          message: "Ошибка авторизации: Пользователь не найден",
        });
      }

      if (user.is_banned) {
        console.error(`❌ [ERROR] Пользователь ${user.user_id} заблокирован!`);
        const bot = new TelegramBot(process.env.BOT_TOKEN);

        await bot.sendMessage(
          user.user_id,
          `Доступ к магазину <b>закрыт</b>. Ваш аккаунт заблокирован.`,
          { parse_mode: 'HTML' }
        );

        return res.status(401).json({
          status: false,
          message: "Ошибка авторизации: Аккаунт заблокирован",
        });
      }

      req.headers = { ...req.headers, user };
      console.log("✅ [INFO] Авторизация успешна!");
      next();
    } catch (error) {
      console.error("❌ [ERROR] Ошибка обработки авторизации:", error);
      return res.status(500).json({
        status: false,
        message: "Ошибка сервера при обработке авторизации",
      });
    }
  }
}
