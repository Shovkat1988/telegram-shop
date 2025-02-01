import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailingService } from './mailing.service';
import { AdminMailingBody } from './dto/mailing-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';

@ApiTags('Админ-панель: Рассылка')
@Controller('admin/mailing')
export class MailingController {
  constructor(private readonly mailingService: MailingService) {}

  @Post()
  @ApiOperation({
    summary: 'Отправка рассылки',
  })
  @ApiResponse({
    status: 200,
    type: CreateDataDto,
  })
  async sendMailing(@Body() body: AdminMailingBody): Promise<CreateDataDto> {
    return await this.mailingService.sendMailing(body);
  }
}
