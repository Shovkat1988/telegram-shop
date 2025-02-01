import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Orders } from 'src/entities/orders.entity';
import { Repository } from 'typeorm';
import { OrdersDataDto } from './dto/orders-data.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async getOrders(
    user: UserDataDto,
    query: GetDataDto,
  ): Promise<OrdersDataDto[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('orders')
      .select([
        'orders.id as id',
        'orders.items as items',
        'orders.full_name as full_name',
        'orders.address as address',
        'orders.previous_amount as previous_amount',
        'orders.phone as phone',
        'orders.amount as amount',
        'orders.payment_type as payment_type',
        'orders.comment as comment',
        'orders.change_from as change_from',
        'orders.status as status',
        'orders.created_at as created_at',
      ])
      .where('orders.created_by = :user_id', { user_id: user.id })
      .orderBy('created_at', 'DESC')
      .limit(query?.limit || 50)
      .offset(query?.offset || 0)
      .getRawMany();

    return orders.map((order) => ({
      ...order,
      items: JSON.parse(order.items),
    }));
  }
}
