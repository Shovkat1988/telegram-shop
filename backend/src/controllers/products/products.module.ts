import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { Categories } from 'src/entities/categories.entity';
import { Payments } from 'src/entities/payments.entity';
import { ProductsOptions } from 'src/entities/products-options.entity';
import { Orders } from 'src/entities/orders.entity';
import { Promocodes } from 'src/entities/promocodes.entity';
import { PromocodesActivations } from 'src/entities/promocodes-activations.entity';
import { Users } from 'src/entities/users.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([
      Products,
      Payments,
      Users,
      Promocodes,
      PromocodesActivations,
      Categories,
      ProductsOptions,
      Orders,
    ]),
  ],
})
export class ProductsModule {}
