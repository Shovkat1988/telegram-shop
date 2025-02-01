import { Injectable } from '@nestjs/common';
import { getConfig, setConfig } from 'src/utils/config.utils';

@Injectable()
export class SettingsService {
  async getSettings() {
    return getConfig();
  }

  async updateSettings(body): Promise<boolean> {
    setConfig(body);

    return true;
  }
}
