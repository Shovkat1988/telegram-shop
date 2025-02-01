import { ApiProperty } from '@nestjs/swagger';

class AppSettings {
  @ApiProperty({
    description: 'Минимальная сумма заказа',
    example: 100,
  })
  min_order_price: number;

  @ApiProperty({
    description: 'Стоимость доставки',
    example: 200,
  })
  delivery_price: number;
}

export class InitializeData {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Идентификатор пользователя в Telegram',
    example: 123456789,
  })
  user_id: number;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Никита',
  })
  first_name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Петров',
  })
  last_name: string;

  @ApiProperty({
    description: 'Имя пользователя в Telegram',
    example: 'nikita_petrov',
  })
  username: string;

  @ApiProperty({
    description: 'Статус администратора',
    example: false,
  })
  is_admin: boolean;

  @ApiProperty({
    description: 'Номер телефона пользователя',
    example: '+71234567890',
  })
  phone: string | null;

  @ApiProperty({
    description: 'Настройки приложения',
    type: AppSettings,
  })
  app_settings: AppSettings;
}
