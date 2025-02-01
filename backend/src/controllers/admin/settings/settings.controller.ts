import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { AdminSettingsData } from './dto/settings-data.dto';

@ApiTags('Настройки')
@Controller('admin/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение настроек приложения.',
  })
  @ApiResponse({
    status: 200,
    type: AdminSettingsData,
  })
  async getSettings(): Promise<AdminSettingsData> {
    return this.settingsService.getSettings();
  }

  @Patch()
  @ApiOperation({
    summary: 'Изменение настроек приложения.',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async updateSettings(@Body() body): Promise<boolean> {
    return this.settingsService.updateSettings(body);
  }
}
