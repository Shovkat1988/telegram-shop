import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { GetDataDto } from 'src/dto/get-data.dto';
import { CategoriesData } from './dto/categories-data.dto';

@ApiTags('Категории')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка категорий',
  })
  @ApiResponse({
    status: 200,
    type: CategoriesData,
    isArray: true,
  })
  async getCategories(@Query() query: GetDataDto): Promise<CategoriesData[]> {
    return await this.categoriesService.getCategories(query);
  }
}
