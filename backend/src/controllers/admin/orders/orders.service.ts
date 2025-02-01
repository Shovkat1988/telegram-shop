import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { Orders } from 'src/entities/orders.entity';
import { Repository } from 'typeorm';
import { AdminOrdersDataDto } from './dto/orders-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async getOrders(query: GetDataDto): Promise<AdminOrdersDataDto[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('orders')
      .select([
        'orders.id as id',
        'orders.items as items',
        'orders.full_name as full_name',
        'orders.change_from as change_from',
        'orders.payment_type as payment_type',
        'orders.address as address',
        'orders.comment as comment',
        'orders.phone as phone',
        'orders.amount as amount',
        'orders.previous_amount as previous_amount',
        'orders.status as status',
        'orders.created_at as created_at',
      ])
      .where('orders.status != :status', { status: 3 })
      .andWhere('orders.status != :status', { status: 4 })
      .orderBy('orders.created_at', 'DESC')
      .limit(query?.limit || 50)
      .offset(query?.offset || 0)
      .getRawMany();

    return orders.map((order) => ({
      ...order,
      items: JSON.parse(order.items),
    }));
  }

  async changePrice(id: number, newPrice: number): Promise<boolean> {
    const findOrder = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(['orders.id as id', 'users.user_id as user_id'])
      .where('orders.id = :id', { id })
      .innerJoin('orders.created_by', 'users')
      .getRawOne();

    if (!findOrder) errorGenerator(Errors.NOT_FOUND);

    await this.ordersRepository
      .createQueryBuilder()
      .update(Orders)
      .set({ amount: newPrice })
      .where('id = :id', { id })
      .execute();

    const bot = new TelegramBot(process.env.BOT_TOKEN);

    await bot.sendMessage(
      findOrder.user_id,
      `Стоимость вашего заказа №${id} была изменена на <b>${newPrice}</b> руб.`,
      {
        parse_mode: 'HTML',
      },
    );

    return true;
  }

  async changeStatus(id: number, status: number): Promise<boolean> {
    const findOrder = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(['orders.id as id', 'users.user_id as user_id'])
      .where('orders.id = :id', { id })
      .innerJoin('orders.created_by', 'users')
      .getRawOne();

    if (!findOrder) errorGenerator(Errors.NOT_FOUND);

    await this.ordersRepository
      .createQueryBuilder()
      .update(Orders)
      .set({ status })
      .where('id = :id', { id })
      .execute();

    const statusDetails = [
      '🆕 Заказ №$id был <b>создан</b>',
      '🔍 Заказ №$id был <b>передан в обработку</b>',
      '🚚 Заказ №$id был <b>передан курьеру</b>',
      '✅ Заказ №$id был <b>завершен</b>',
      '❌ Заказ №$id был <b>отменен</b>',
    ];

    const bot = new TelegramBot(process.env.BOT_TOKEN);

    await bot.sendMessage(
      findOrder.user_id,
      statusDetails[status].replace('$id', id.toString()),
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Перейти к заказу',
                web_app: {
                  url: process.env.MINI_APP_STATIC_URL,
                },
              },
            ],
          ],
        },
      },
    );

    return true;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const findOrder = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(['orders.id as id'])
      .where('id = :id', { id })
      .getRawOne();

    if (!findOrder) errorGenerator(Errors.NOT_FOUND);

    await this.ordersRepository
      .createQueryBuilder()
      .update(Orders)
      .set({ status: 4 })
      .where('id = :id', { id })
      .execute();

    return true;
  }
}
