import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDto } from 'src/dto/user-data.dto';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';
import {
  AdminCategoriesBody,
  AdminCategoriesPatchBody,
} from './dto/categories-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { Products } from 'src/entities/products.entity';
import { GetDataDto } from 'src/dto/get-data.dto';
import { AdminCategoriesData } from './dto/categories-data.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,

    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async getCategories(query: GetDataDto): Promise<AdminCategoriesData[]> {
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

    return categories.map((category) => ({
      ...category,
      products_count: +category.products_count,
    }));
  }

  async createCategory(
    user: UserDataDto,
    body: AdminCategoriesBody,
  ): Promise<CreateDataDto> {
    const findDuplicate = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select(['categories.id as id'])
      .where('categories.title = :title', { title: body.title })
      .andWhere('categories.is_deleted = :is_deleted', { is_deleted: false })
      .getRawOne();

    if (findDuplicate) errorGenerator(Errors.ALREADY_EXISTS);

    const insertAction = await this.categoriesRepository
      .createQueryBuilder()
      .insert()
      .into(Categories)
      .values({
        title: body.title,
        created_by: user.id,
        created_at: getCurrentTimestamp(),
      })
      .execute();

    return {
      id: insertAction.identifiers[0].id,
    };
  }

  async deleteCategory(category_id: number): Promise<boolean> {
    const category = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select(['categories.id as id'])
      .where('categories.id = :category_id', { category_id: category_id })
      .andWhere('categories.is_deleted = :is_deleted', { is_deleted: false })
      .getRawOne();

    if (!category) errorGenerator(Errors.NOT_FOUND);

    await this.productsRepository
      .createQueryBuilder()
      .update(Products)
      .set({
        is_deleted: true,
        updated_at: getCurrentTimestamp(),
      })
      .where('category_id = :category_id', { category_id: category_id })
      .andWhere('is_deleted = :is_deleted', { is_deleted: false })
      .execute();

    await this.categoriesRepository
      .createQueryBuilder()
      .update(Categories)
      .set({
        is_deleted: true,
      })
      .where('id = :id', { id: category_id })
      .execute();

    return true;
  }

  async editCategory(
    category_id: number,
    body: AdminCategoriesPatchBody,
  ): Promise<CreateDataDto> {
    if (!body.title) errorGenerator(Errors.BAD_REQUEST);

    const category = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select(['categories.id as id', 'categories.title as title'])
      .where('categories.id = :category_id', {
        category_id: category_id,
      })
      .andWhere('categories.is_deleted = :is_deleted', {
        is_deleted: false,
      })
      .getRawOne();

    if (!category) errorGenerator(Errors.NOT_FOUND);

    await this.categoriesRepository
      .createQueryBuilder()
      .update(Categories)
      .set(body)
      .where('id = :id', { id: category_id })
      .execute();

    return {
      id: category_id,
    };
  }
}
