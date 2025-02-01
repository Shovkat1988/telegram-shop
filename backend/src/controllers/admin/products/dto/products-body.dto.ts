import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

class Options {
  @ApiProperty({
    description: 'Описание',
    example: 'Описание',
  })
  @IsString()
  @Length(1, 128)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'Стоимость товара',
    example: 1,
  })
  @IsNumber()
  sell_price: number;
}

export class AdminProductsBody {
  @ApiProperty({
    description: 'Заголовок товара',
    example: 'Товар',
  })
  @IsString()
  @Length(1, 128)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'Описание товара',
    example: 'Описание товара',
  })
  @IsString()
  @Length(1, 128)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @ApiProperty({
    description: 'ID изображения товара',
    example: 1,
  })
  @IsNumber()
  image_id: number;

  @ApiProperty({
    description: 'Стоимость товара',
    example: 100,
  })
  @IsNumber()
  sell_price: number;

  @ApiProperty({
    description: 'Дополнительные опции',
    example: {
      title: 'Описание',
      sell_price: 1,
    },
  })
  @IsOptional()
  options: Options[];
}

export class AdminProductsPatchBody {
  @ApiProperty({
    description: 'Заголовок товара',
    example: 'Товар',
  })
  @IsOptional()
  @IsString()
  @Length(1, 128)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'Описание товара',
    example: 'Описание товара',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1024)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @ApiProperty({
    description: 'Категория товара',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  category_id: number;

  @ApiProperty({
    description: 'ID изображения товара',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  image_id: number;

  @ApiProperty({
    description: 'Стоимость товара',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  sell_price: number;

  @ApiProperty({
    description: 'Дополнительные опции',
    example: {
      title: 'Описание',
      sell_price: 1,
    },
  })
  @IsOptional()
  options: Options[];
}

class Items {
  @ApiProperty({
    description: 'Заголовок товара',
    example: 'Товар',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Позиция товара',
    example: 1,
  })
  @IsNumber()
  position: number;
}

export class AdminProductsPositionPatchBody {
  @ApiProperty({
    description: 'Список товаров',
    example: {
      id: 1,
      position: 1,
    },
  })
  @IsOptional()
  items: Items[];
}
