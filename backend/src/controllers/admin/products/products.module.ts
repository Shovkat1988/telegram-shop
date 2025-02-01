import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Products } from 'src/entities/products.entity';
import { Uploads } from 'src/entities/uploads.entity';
import { ProductsOptions } from 'src/entities/products-options.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Categories, Products, ProductsOptions, Uploads]),
  ],
})
export class ProductsModule {}
