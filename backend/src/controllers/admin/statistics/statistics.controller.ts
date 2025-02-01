import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { StatistcisData } from './dto/statistics-data.dto';

@ApiTags('Админ-панель: Статистика')
@Controller('admin/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение статистики',
  })
  @ApiResponse({
    status: 200,
    type: StatistcisData,
  })
  async getStatistics(): Promise<StatistcisData> {
    return await this.statisticsService.getStatistics();
  }
}
