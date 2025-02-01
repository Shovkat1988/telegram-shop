import { ApiProperty } from '@nestjs/swagger';

export class AdminOrdersDataDto {
  @ApiProperty({
    description: 'Идентификатор покупки',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ФИО',
    example: 'Иванов Иван Иванович',
  })
  full_name: string;

  @ApiProperty({
    description: 'Адрес',
    example: 'г. Москва, ул. Ленина, д. 1',
  })
  address: string;

  @ApiProperty({
    description: 'Тип оплаты',
    example: 0,
  })
  payment_type: number;

  @ApiProperty({
    description: 'Сдача с',
    example: 500,
  })
  change_from: number;

  @ApiProperty({
    description: 'Телефон',
    example: '8 (800) 555-35-35',
  })
  phone: string;

  @ApiProperty({
    description: 'Сумма',
    example: 100,
  })
  amount: number;

  @ApiProperty({
    description: 'Статус',
    example: 0,
  })
  status: number;

  @ApiProperty({
    description: 'Предыдущая сумма',
    example: 100,
  })
  previous_amount: number;

  @ApiProperty({
    description: 'Комментарий',
    example: 100,
  })
  comment: string;

  @ApiProperty({
    description: 'Товары',
    example: '[{"id":1,"title":"Товар","sell_price":100}]',
  })
  items: string;

  @ApiProperty({
    description: 'Дата создания',
    example: 1631692800,
  })
  created_at: number;
}
