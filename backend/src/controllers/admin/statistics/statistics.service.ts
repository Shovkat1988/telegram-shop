import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { StatistcisData } from './dto/statistics-data.dto';
import { Orders } from 'src/entities/orders.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async getStatistics(): Promise<StatistcisData> {
    const usersCount = await this.usersRepository
      .createQueryBuilder('users')
      .select(['COUNT(*)'])
      .getRawOne();

    const totalOrders = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(['COUNT(*)'])
      .getRawOne();

    const totalAmount = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(['SUM(amount)'])
      .getRawOne();

    return {
      users_count: +usersCount['COUNT(*)'],
      total_orders: +totalOrders['COUNT(*)'],
      total_amount: +totalAmount['SUM(amount)'],
    };
  }
}
