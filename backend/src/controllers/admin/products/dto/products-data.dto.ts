import { ApiProperty } from '@nestjs/swagger';

export class AdminProductsData {
  @ApiProperty({
    description: 'Идентификатор товара',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Название товара',
    example: 'Товар',
  })
  title: string;

  @ApiProperty({
    description: 'Описание товара',
    example: 'Описание товара',
  })
  description: string;

  @ApiProperty({
    description: 'Категория товара',
    example: 1,
  })
  category_id: number;

  @ApiProperty({
    description: 'Позиция товара',
    example: 1,
  })
  position: number;

  @ApiProperty({
    description: 'Изображение товара',
    example: 'http://localhost:3000/static/...',
  })
  image_url: string;

  @ApiProperty({
    description: 'Стоимость товара',
    example: 100,
  })
  sell_price: number;

  @ApiProperty({
    description: 'Количество товара в наличии',
    example: 100,
  })
  quantity_in_stock: number;
}
