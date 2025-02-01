import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { GetDataDto } from 'src/dto/get-data.dto';
import { AdminProductsData } from './dto/products-data.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import {
  AdminProductsBody,
  AdminProductsPatchBody,
  AdminProductsPositionPatchBody,
} from './dto/products-body.dto';
import { UserDataDto } from 'src/dto/user-data.dto';

@ApiTags('Админ-панель: Товары')
@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/:category_id')
  @ApiOperation({
    summary: 'Получение списка товаров',
  })
  @ApiResponse({
    status: 200,
    type: AdminProductsData,
    isArray: true,
  })
  async getProducts(
    @Param('category_id') category_id: number,
    @Query() query: GetDataDto,
  ): Promise<AdminProductsData[]> {
    return await this.productsService.getProducts(category_id, query);
  }

  @Post('/:category_id')
  @ApiOperation({
    summary: 'Добавление товара',
  })
  @ApiResponse({
    status: 200,
    type: CreateDataDto,
  })
  async createProduct(
    @Param('category_id') category_id: number,
    @Body() body: AdminProductsBody,
    @Headers('user') user: UserDataDto,
  ): Promise<CreateDataDto> {
    return await this.productsService.createProduct(user, category_id, body);
  }

  @Patch('/:category_id/position')
  @ApiOperation({
    summary: 'Изменение позиции товара',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async changePosition(
    @Param('category_id') category_id: number,
    @Body() body: AdminProductsPositionPatchBody,
  ): Promise<boolean> {
    return await this.productsService.changePosition(category_id, body);
  }

  @Patch('/:category_id/:product_id')
  @ApiOperation({
    summary: 'Изменение товара',
  })
  @ApiResponse({
    status: 200,
    type: CreateDataDto,
  })
  async updateProduct(
    @Param('category_id') category_id: number,
    @Param('product_id') product_id: number,
    @Body() body: AdminProductsPatchBody,
    @Headers('user') user: UserDataDto,
  ): Promise<CreateDataDto> {
    return await this.productsService.updateProduct(
      category_id,
      product_id,
      body,
      user,
    );
  }

  @Delete('/:category_id/:product_id')
  @ApiOperation({
    summary: 'Удаление товара',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteProduct(
    @Param('category_id') category_id: number,
    @Param('product_id') product_id: number,
  ): Promise<boolean> {
    return await this.productsService.deleteProduct(category_id, product_id);
  }
}
