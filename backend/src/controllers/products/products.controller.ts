import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductsData, ProductsPurchaseData } from './dto/products-data.dto';
import { ProductsBody } from './dto/products-body.dto';
import { UserDataDto } from 'src/dto/user-data.dto';
import {
  GetProductsByCategoriesQueryDto,
  ProductsQueryDto,
} from './dto/products-query.dto';

@ApiTags('Товары')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/categories')
  @ApiOperation({
    summary: 'Получение товаров по категории',
  })
  @ApiResponse({
    status: 200,
    type: ProductsData,
    isArray: true,
  })
  async getProductsByCategory(
    @Query() query: GetProductsByCategoriesQueryDto,
  ): Promise<ProductsData[]> {
    return await this.productsService.getProductsByCategory(query);
  }

  @Get()
  @ApiOperation({
    summary: 'Получение списка товаров',
  })
  @ApiResponse({
    status: 200,
    type: ProductsData,
    isArray: true,
  })
  async getProducts(@Query() query: ProductsQueryDto): Promise<ProductsData[]> {
    return await this.productsService.getProducts(query);
  }

  @Get('/purchase/:purchase_id')
  @ApiOperation({
    summary: 'Получение данных о покупке',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async getPurchaseData(
    @Headers('user') user: UserDataDto,
    @Param('purchase_id') purchase_id: number,
  ): Promise<boolean> {
    return await this.productsService.getPurchaseData(user, purchase_id);
  }

  @Post('/purchase')
  @ApiOperation({
    summary: 'Покупка товаров',
  })
  @ApiResponse({
    status: 200,
    type: ProductsPurchaseData,
  })
  async purchaseProducts(
    @Headers('user') user: UserDataDto,
    @Body() body: ProductsBody,
  ): Promise<ProductsPurchaseData> {
    return await this.productsService.purchaseProducts(user, body);
  }
}
