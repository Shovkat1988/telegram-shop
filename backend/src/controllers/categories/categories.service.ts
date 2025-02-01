import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';
import { CategoriesData } from './dto/categories-data.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories(query: GetDataDto): Promise<CategoriesData[]> {
    const categories = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select([
        'categories.id as id',
        'categories.title as title',
        '(SELECT COUNT(products.id) FROM products WHERE products.category_id = categories.id AND products.is_deleted = false) as products_count',
      ])
      .where('categories.is_deleted = :is_deleted', { is_deleted: false })
      .offset(query?.offset || 0)
      .limit(query?.limit || 50)
      .getRawMany();

    return categories
      .filter((category) => +category.products_count)
      .map((category) => ({
        ...category,
        products_count: undefined,
      }));
  }
}
