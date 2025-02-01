import {
  Body,
  Headers,
  Controller,
  Get,
  Post,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PromocodesService } from './promocodes.service';
import { GetDataDto } from 'src/dto/get-data.dto';
import { PromocodesDataDto } from './dto/promocodes-data.dto';
import { AdminPromocodesBody } from './dto/promocodes-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import { UserDataDto } from 'src/dto/user-data.dto';

@ApiTags('Промокоды')
@Controller('admin/promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка промокодов',
  })
  @ApiResponse({
    status: 200,
    type: PromocodesDataDto,
    isArray: true,
  })
  async getPromocodes(
    @Query() query: GetDataDto,
  ): Promise<PromocodesDataDto[]> {
    return await this.promocodesService.getPromocodes(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Создание промокода',
  })
  @ApiResponse({
    status: 200,
    type: PromocodesDataDto,
  })
  async createPromocode(
    @Headers('user') user: UserDataDto,
    @Body() body: AdminPromocodesBody,
  ): Promise<CreateDataDto> {
    return await this.promocodesService.createPromocode(body, user);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Удаление промокода',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deletePromocode(@Param('id') id: number): Promise<boolean> {
    return await this.promocodesService.deletePromocode(id);
  }
}
