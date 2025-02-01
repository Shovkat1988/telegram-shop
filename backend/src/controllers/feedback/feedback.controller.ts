import { Body, Headers, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { FeedbackBody } from './dto/feedback-body.dto';
import { UserDataDto } from 'src/dto/user-data.dto';

@ApiTags('Обратная связь')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({
    summary: 'Отправка обратной связи.',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async sendFeedback(
    @Headers('user') user: UserDataDto,
    @Body() body: FeedbackBody,
  ): Promise<boolean> {
    return this.feedbackService.sendFeedback(user, body);
  }
}
