import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class AdminMailingBody {
  @ApiProperty({
    description: 'Изображение для рассылки',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  image_id: number;

  @ApiProperty({
    description: 'Текст рассылки',
    example: 'Текст рассылки',
  })
  @IsOptional()
  @IsString()
  @Length(1, 4096)
  text: string;
}
