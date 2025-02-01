import { Injectable } from '@nestjs/common';
import { UserDataDto } from 'src/dto/user-data.dto';
import { InitializeData } from './dto/initialize-data.dto';
import { getConfig } from 'src/utils/config.utils';

@Injectable()
export class InitializeService {
  async initialize(user: UserDataDto): Promise<InitializeData> {
    const config = getConfig();

    return {
      id: user.id,
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      is_admin: Boolean(user.is_admin),
      phone: user.phone,
      app_settings: {
        delivery_price: config.delivery_price,
        min_order_price: config.min_order_price,
      },
    };
  }
}
