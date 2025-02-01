import { Controller, Headers, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { GetDataDto } from 'src/dto/get-data.dto';
import { UserDataDto } from 'src/dto/user-data.dto';
import { OrdersDataDto } from './dto/orders-data.dto';

@ApiTags('Заказы')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение заказов',
  })
  @ApiResponse({
    status: 200,
    type: OrdersDataDto,
    isArray: true,
  })
  async getOrders(
    @Headers('user') user: UserDataDto,
    @Query() query: GetDataDto,
  ): Promise<OrdersDataDto[]> {
    return await this.ordersService.getOrders(user, query);
  }
}
