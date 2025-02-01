import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AdminOrdersDataDto } from './dto/orders-data.dto';
import { GetDataDto } from 'src/dto/get-data.dto';

@ApiTags('Заказы')
@Controller('admin/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение заказов',
  })
  @ApiResponse({
    status: 200,
    type: AdminOrdersDataDto,
    isArray: true,
  })
  async getOrders(@Query() query: GetDataDto): Promise<AdminOrdersDataDto[]> {
    return await this.ordersService.getOrders(query);
  }

  @Patch('/:id/price/:new_price')
  @ApiOperation({
    summary: 'Изменение цены заказа',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async changePrice(
    @Param('id') id: number,
    @Param('new_price') newPrice: number,
  ): Promise<boolean> {
    return await this.ordersService.changePrice(id, newPrice);
  }

  @Patch('/:id/status/:status')
  @ApiOperation({
    summary: 'Изменение статуса заказа',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async changeStatus(
    @Param('id') id: number,
    @Param('status') status: number,
  ): Promise<boolean> {
    return await this.ordersService.changeStatus(id, status);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Удаление заказа',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteOrder(@Param('id') id: number): Promise<boolean> {
    return await this.ordersService.deleteOrder(id);
  }
}
