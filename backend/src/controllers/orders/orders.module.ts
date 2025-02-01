import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/entities/orders.entity';
import { Products } from 'src/entities/products.entity';
import { ProductsOptions } from 'src/entities/products-options.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([Orders, Products, ProductsOptions])],
})
export class OrdersModule {}
