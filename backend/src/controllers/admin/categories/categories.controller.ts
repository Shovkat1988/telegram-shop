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
import { CategoriesService } from './categories.service';
import { UserDataDto } from 'src/dto/user-data.dto';
import {
  AdminCategoriesBody,
  AdminCategoriesPatchBody,
} from './dto/categories-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import { AdminCategoriesData } from './dto/categories-data.dto';
import { GetDataDto } from 'src/dto/get-data.dto';

@ApiTags('Админ-панель: Категории')
@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка категорий',
  })
  @ApiResponse({
    status: 200,
    type: AdminCategoriesData,
    isArray: true,
  })
  async getCategories(
    @Query() query: GetDataDto,
  ): Promise<AdminCategoriesData[]> {
    return await this.categoriesService.getCategories(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Создание категории',
  })
  @ApiResponse({
    status: 200,
    type: CreateDataDto,
  })
  async createCategory(
    @Headers('user') user: UserDataDto,
    @Body() body: AdminCategoriesBody,
  ): Promise<CreateDataDto> {
    return await this.categoriesService.createCategory(user, body);
  }

  @Patch('/:category_id')
  @ApiOperation({
    summary: 'Редактирование категории',
  })
  @ApiResponse({
    status: 200,
    type: CreateDataDto,
  })
  async editCategory(
    @Param('category_id') category_id: number,
    @Body() body: AdminCategoriesPatchBody,
  ): Promise<CreateDataDto> {
    return await this.categoriesService.editCategory(category_id, body);
  }

  @Delete('/:category_id')
  @ApiOperation({
    summary: 'Удаление категории',
  })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  async deleteCategory(
    @Param('category_id') category_id: number,
  ): Promise<boolean> {
    return await this.categoriesService.deleteCategory(category_id);
  }
}
