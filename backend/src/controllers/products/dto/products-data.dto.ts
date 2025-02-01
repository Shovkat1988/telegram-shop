import { ApiProperty } from '@nestjs/swagger';

class ProductsOptionsData {
  @ApiProperty({
    description: 'Идентификатор опции товара',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Идентификатор товара',
    example: 1,
  })
  title: string;

  @ApiProperty({
    description: 'Название опции товара',
    example: 'Опция товара',
  })
  sell_price: number;
}

export class ProductsData {
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
    description: 'Изображение товара',
    example: 'http://localhost:3000/static/...',
  })
  image_url: string;

  @ApiProperty({
    description: 'Позиция товара',
    example: 1,
  })
  position: number;

  @ApiProperty({
    description: 'Стоимость товара',
    example: 100,
  })
  sell_price: number;

  @ApiProperty({
    description: 'Опции товара',
    type: [ProductsOptionsData],
  })
  options: ProductsOptionsData[];
}

export class ProductsPurchaseData {
  @ApiProperty({
    description: 'Идентификатор покупки',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Стоимость товаров',
    example: 100,
  })
  amount: number;

  @ApiProperty({
    description: 'Время создания заказа',
    example: 1631692800,
  })
  timestamp: number;
}
