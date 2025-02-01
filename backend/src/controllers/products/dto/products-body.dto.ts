import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsIn,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class Item {
  @IsNumber()
  id: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  quantity: number;

  @IsNumber({}, { each: true })
  @IsOptional()
  options: number[];
}

export class ProductsBody {
  @ApiProperty({
    description: 'Список товаров',
    example: false,
  })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Item)
  items: Item[];

  @ApiProperty({
    description: 'Промокод',
    example: 'PROMO',
    required: false,
  })
  @IsOptional()
  @IsString()
  promocode?: string;

  @ApiProperty({
    description: 'ФИ пользователя',
    example: 'Иванов Иван Иванович',
  })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 128)
  full_name: string;

  @ApiProperty({
    description: 'Тип оплаты',
    example: 0,
  })
  @IsNumber()
  @IsIn([0, 1])
  payment_type: number;

  @ApiProperty({
    description: 'Сдача с',
    example: 500,
  })
  @IsNumber()
  @IsOptional()
  change_from: number;

  @ApiProperty({
    description: 'Адрес пользователя',
    example: 'г. Москва, ул. Ленина, д. 1',
  })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 128)
  address: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '79999999999',
  })
  @IsString()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({
    description: 'Комментарий к заказу',
    example: 'Комментарий',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 128)
  comment: string;
}
