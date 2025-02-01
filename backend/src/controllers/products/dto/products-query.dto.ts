import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ProductsQueryDto {
  @ApiProperty({
    description: 'id товаров',
    example: [1, 2, 3],
    required: true,
  })
  @IsString()
  ids: string;
}

export class GetProductsByCategoriesQueryDto {
  @ApiProperty({
    description: 'id товаров',
    example: [1, 2, 3],
    required: true,
  })
  @IsString()
  ids: string;

  @ApiProperty({
    description: 'Лимит',
    example: 50,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Отступ',
    example: 10,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  offset?: number;
}
