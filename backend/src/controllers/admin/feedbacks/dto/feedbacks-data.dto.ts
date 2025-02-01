import { ApiProperty } from '@nestjs/swagger';

export class AdminFeedbacksData {
  @ApiProperty({
    description: 'Идентификатор покупки',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Сообщение',
    example: 'Сообщение',
  })
  message: string;

  @ApiProperty({
    description: 'Дата создания',
    example: 1621842953,
  })
  created_at: number;
}
