import { ApiProperty } from '@nestjs/swagger';

export class StatistcisData {
  @ApiProperty({
    description: 'Количество пользователей',
    example: 1,
  })
  users_count: number;

  @ApiProperty({
    description: 'Количество заказов',
    example: 1,
  })
  total_orders: number;

  @ApiProperty({
    description: 'Общая сумма заказов',
    example: 100,
  })
  total_amount: number;
}
