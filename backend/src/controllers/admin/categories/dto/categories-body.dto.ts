import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

export class AdminCategoriesBody {
  @ApiProperty({
    description: 'Название категории',
    example: 'Категория',
  })
  @IsString()
  @Length(6, 128)
  title: string;
}

export class AdminCategoriesPatchBody {
  @ApiProperty({
    description: 'Название категории',
    example: 'Категория',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 128)
  title: string;
}
