import { ApiProperty } from '@nestjs/swagger';

export class PromocodesDataDto {
  @ApiProperty({
    description: 'Идентификатор кода',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Код',
    example: 'PROMO',
  })
  code: string;

  @ApiProperty({
    description: 'Количество активаций оставшееся',
    example: 10,
  })
  activations_left: number;

  @ApiProperty({
    description: 'Скидка',
    example: 10,
  })
  discount: number;

  @ApiProperty({
    description: 'Дата создания',
    example: 1631692800,
  })
  created_at: number;
}
