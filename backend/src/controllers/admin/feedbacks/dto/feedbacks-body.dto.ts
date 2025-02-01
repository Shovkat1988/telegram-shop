import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class AdminFeedbacksBody {
  @ApiProperty({
    description: 'Сообщение',
    example: 'Сообщение',
  })
  @IsString()
  @Length(1, 4096)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  message: string;
}
