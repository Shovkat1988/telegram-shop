import { ApiProperty } from '@nestjs/swagger';

export class AdminUsersData {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Идентификатор пользователя в Telegram',
    example: 1234567890,
  })
  user_id: number;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  first_name: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
  })
  last_name: string;

  @ApiProperty({
    description: 'Никнейм пользователя',
    example: 'ivanov',
  })
  username: string;

  @ApiProperty({
    description: 'Является ли пользователь администратором',
    example: false,
  })
  is_admin: boolean;

  @ApiProperty({
    description: 'Дата регистрации',
    example: 1620000000,
  })
  joined_at: number;
}
