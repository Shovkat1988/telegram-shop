import { Controller, Headers, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PromocodesService } from './promocodes.service';
import { UserDataDto } from 'src/dto/user-data.dto';

@ApiTags('Промокоды')
@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Get('/:promocode')
  @ApiOperation({
    summary: 'Проверка промокода',
  })
  @ApiResponse({
    status: 200,
    type: Number,
  })
  async getPromocode(
    @Headers('user') user: UserDataDto,
    @Param('promocode') promocode: string,
  ): Promise<number> {
    return await this.promocodesService.getPromocode(user, promocode);
  }
}
