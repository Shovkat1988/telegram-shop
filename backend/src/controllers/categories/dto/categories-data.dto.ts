import { ApiProperty } from '@nestjs/swagger';

export class CategoriesData {
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
}
