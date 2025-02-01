import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class AdminPromocodesBody {
  @ApiProperty({
    description: 'Код',
    example: 'PROMO',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Количество активаций',
    example: 10,
  })
  @IsNumber()
  activations_left: number;

  @ApiProperty({
    description: 'Скидка',
    example: 10,
  })
  @Min(1)
  @Max(100)
  @IsNumber()
  discount: number;
}
