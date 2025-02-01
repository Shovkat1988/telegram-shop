import { ApiProperty } from '@nestjs/swagger';

export class AdminSettingsData {
  @ApiProperty({
    description: 'Минимальная сумма заказа',
    example: 100,
  })
  min_order_price: number;
}
