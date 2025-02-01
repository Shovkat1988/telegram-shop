import { ApiProperty } from '@nestjs/swagger';

export class UserDataDto {
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
    description: 'Статус бана',
    example: false,
  })
  is_banned: boolean;

  @ApiProperty({
    description: 'Номер телефона пользователя',
    example: '+71234567890',
  })
  phone: string | null;

  @ApiProperty({
    description: 'Дата последнего обновления данных пользователя (timestamp)',
    example: 1610000000,
  })
  updated_at: number;

  @ApiProperty({
    description: 'Дата регистрации пользователя (timestamp)',
    example: 1610000000,
  })
  joined_at: number;
}
