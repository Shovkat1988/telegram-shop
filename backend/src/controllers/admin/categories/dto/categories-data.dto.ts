import { ApiProperty } from '@nestjs/swagger';

export class AdminCategoriesData {
  @ApiProperty({
    description: 'Идентификатор категории',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Название категории',
    example: 'Категория',
  })
  title: string;

  @ApiProperty({
    description: 'Количество товаров в категории',
    example: 1,
  })
  products_count: number;
}
