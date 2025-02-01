import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Orders } from 'src/entities/orders.entity';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [TypeOrmModule.forFeature([Users, Orders])],
})
export class StatisticsModule {}
