import {
  Body,
  Controller,
  Headers,
  Get,
  Post,
  Query,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbacksService } from './feedbacks.service';
import { AdminFeedbacksData } from './dto/feedbacks-data.dto';
import { GetDataDto } from 'src/dto/get-data.dto';
import { AdminFeedbacksBody } from './dto/feedbacks-body.dto';
import { UserDataDto } from 'src/dto/user-data.dto';

@ApiTags('Обратная связь')
@Controller('admin/feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка обратной связи',
  })
  @ApiResponse({
    status: 200,
    type: AdminFeedbacksData,
    isArray: true,
  })
  async getFeedbacks(
    @Query() query: GetDataDto,
  ): Promise<AdminFeedbacksData[]> {
    return await this.feedbacksService.getFeedbacks(query);
  }

  @Post('/:feedback_id')
  @ApiOperation({
    summary: 'Ответ на обратную связь',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async answerFeedback(
    @Headers('user') user: UserDataDto,
    @Param('feedback_id') feedbackId: number,
    @Body() body: AdminFeedbacksBody,
  ): Promise<boolean> {
    return await this.feedbacksService.answerFeedback(user, feedbackId, body);
  }
}
