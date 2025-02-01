import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataDto } from 'src/dto/get-data.dto';
import { Categories } from 'src/entities/categories.entity';
import { Products } from 'src/entities/products.entity';
import { Uploads } from 'src/entities/uploads.entity';
import { Repository } from 'typeorm';
import { AdminProductsData } from './dto/products-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import {
  AdminProductsBody,
  AdminProductsPatchBody,
  AdminProductsPositionPatchBody,
} from './dto/products-body.dto';
import { CreateDataDto } from 'src/dto/create-data.dto';
import validateImage from 'src/utils/validateImage.utils';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { UserDataDto } from 'src/dto/user-data.dto';
import { ProductsOptions } from 'src/entities/products-options.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,

    @InjectRepository(Uploads)
    private readonly uploadsRepository: Repository<Uploads>,

    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,

    @InjectRepository(ProductsOptions)
    private readonly productsOptionsRepository: Repository<ProductsOptions>,
  ) {}

  async getProducts(
    category_id: number,
    query: GetDataDto,
  ): Promise<AdminProductsData[]> {
    const findCategory = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select(['categories.id as id'])
      .where('categories.id = :id', { id: category_id })
      .andWhere('categories.is_deleted = :is_deleted', {
        is_deleted: false,
      })
      .getRawOne();

    if (!findCategory) errorGenerator(Errors.NOT_FOUND);

    const products = await this.productsRepository
      .createQueryBuilder('products')
      .select([
        'products.id as id',
        'products.title as title',
        'products.description as description',
        'products.sell_price as sell_price',
        'products.category_id as category_id',
        'products.position as position',
        'uploads.url as image_url',
      ])
      .where('products.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('products.category_id = :category_id', { category_id })
      .innerJoin('products.image_id', 'uploads')
      .orderBy('products.position', 'ASC')
      .offset(query?.offset || 0)
      .limit(query?.limit || 50)
      .getRawMany();

    const productsIds = products.map((product) => product.id);

    if (!productsIds.length) return [];

    const options = await this.productsOptionsRepository
      .createQueryBuilder('products_options')
      .select([
        'products_options.id as id',
        'products_options.product_id as product_id',
        'products_options.title as title',
        'products_options.sell_price as sell_price',
      ])
      .where('products_options.product_id IN (:...productsIds)', {
        productsIds,
      })
      .getRawMany();

    return products.map((product) => {
      const productOptions = options.filter(
        (option) => option.product_id === product.id,
      );

      return {
        ...product,
        options: productOptions.map((option) => ({
          id: option.id,
          title: option.title,
          sell_price: option.sell_price,
        })),
      };
    });
  }

  async createProduct(
    user: UserDataDto,
    category_id: number,
    body: AdminProductsBody,
  ): Promise<CreateDataDto> {
    const findCategory = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select(['categories.id as id'])
      .where('categories.id = :id', { id: category_id })
      .andWhere('categories.is_deleted = :is_deleted', {
        is_deleted: false,
      })
      .getRawOne();

    if (!findCategory) errorGenerator(Errors.NOT_FOUND);

    const findProduct = await this.productsRepository
      .createQueryBuilder('products')
      .select(['products.id as id'])
      .where('products.title = :title', { title: body.title })
      .andWhere('products.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('products.category_id = :category_id', { category_id })
      .getRawOne();

    if (findProduct) errorGenerator(Errors.ALREADY_EXISTS);

    const image = await validateImage(this.uploadsRepository, body.image_id);

    const lastPosition = await this.productsRepository
      .createQueryBuilder('products')
      .select(['products.position as position'])
      .where('products.category_id = :category_id', { category_id })
      .orderBy('products.position', 'DESC')
      .getRawOne();

    const insertAction = await this.productsRepository
      .createQueryBuilder('products')
      .insert()
      .into(Products)
      .values({
        title: body.title,
        description: body.description,
        category_id,
        image_id: body.image_id,
        position: lastPosition ? lastPosition.position + 1 : 0,
        sell_price: body.sell_price,
        created_by: user.id,
        updated_at: getCurrentTimestamp(),
        created_at: getCurrentTimestamp(),
      })
      .execute();

    if (body?.options) {
      for await (const option of body.options) {
        await this.productsOptionsRepository
          .createQueryBuilder('products_options')
          .insert()
          .into(ProductsOptions)
          .values({
            title: option.title,
            sell_price: option.sell_price,
            product_id: insertAction.identifiers[0].id,
            created_by: user.id,
            updated_at: getCurrentTimestamp(),
            created_at: getCurrentTimestamp(),
          })
          .execute();
      }
    }

    return {
      id: insertAction.identifiers[0].id,
      image_url: image.url,
    };
  }

  async changePosition(
    category_id: number,
    body: AdminProductsPositionPatchBody,
  ): Promise<boolean> {
    const findCategory = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select(['categories.id as id'])
      .where('categories.id = :id', { id: category_id })
      .andWhere('categories.is_deleted = :is_deleted', {
        is_deleted: false,
      })
      .getRawOne();

    if (!findCategory) errorGenerator(Errors.NOT_FOUND);

    for await (const product of body.items) {
      await this.productsRepository
        .createQueryBuilder()
        .update(Products)
        .set({
          position: product.position,
          updated_at: getCurrentTimestamp(),
        })
        .where('id = :id', { id: product.id })
        .andWhere('category_id = :category_id', { category_id })
        .execute();
    }

    return true;
  }

  async updateProduct(
    category_id: number,
    product_id: number,
    body: AdminProductsPatchBody,
    user: UserDataDto,
  ): Promise<CreateDataDto> {
    const findProduct = await this.productsRepository
      .createQueryBuilder('products')
      .select(['products.id as id'])
      .where('products.id = :id', { id: product_id })
      .andWhere('products.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('products.category_id = :category_id', { category_id })
      .getRawOne();

    if (!findProduct) errorGenerator(Errors.NOT_FOUND);

    if (body.category_id) {
      const findCategory = await this.categoriesRepository
        .createQueryBuilder('categories')
        .select(['categories.id as id'])
        .where('categories.id = :id', { id: body.category_id })
        .andWhere('categories.is_deleted = :is_deleted', {
          is_deleted: false,
        })
        .getRawOne();

      if (!findCategory) errorGenerator(Errors.NOT_FOUND);
    }

    let image = null;

    if (body.image_id)
      image = await validateImage(this.uploadsRepository, body.image_id);

    if (body?.options) {
      await this.productsOptionsRepository
        .createQueryBuilder()
        .delete()
        .from(ProductsOptions)
        .where('product_id = :product_id', { product_id })
        .execute();

      for await (const option of body.options) {
        await this.productsOptionsRepository
          .createQueryBuilder('products_options')
          .insert()
          .into(ProductsOptions)
          .values({
            title: option.title,
            sell_price: option.sell_price,
            product_id,
            created_by: user.id,
            updated_at: getCurrentTimestamp(),
            created_at: getCurrentTimestamp(),
          })
          .execute();
      }
    }

    body.options = undefined;

    await this.productsRepository
      .createQueryBuilder()
      .update(Products)
      .set({
        ...body,
        updated_at: getCurrentTimestamp(),
      })
      .where('id = :id', { id: product_id })
      .execute();

    return {
      id: product_id,
      image_url: image?.url || undefined,
    };
  }

  async deleteProduct(
    category_id: number,
    product_id: number,
  ): Promise<boolean> {
    const findCategory = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select(['categories.id as id'])
      .where('categories.id = :id', { id: category_id })
      .andWhere('categories.is_deleted = :is_deleted', {
        is_deleted: false,
      })
      .getRawOne();

    if (!findCategory) errorGenerator(Errors.NOT_FOUND);

    const findProduct = await this.productsRepository
      .createQueryBuilder('products')
      .select(['products.id as id'])
      .where('products.id = :id', { id: product_id })
      .andWhere('products.is_deleted = :is_deleted', { is_deleted: false })
      .andWhere('products.category_id = :category_id', { category_id })
      .getRawOne();

    if (!findProduct) errorGenerator(Errors.NOT_FOUND);

    await this.productsRepository
      .createQueryBuilder()
      .update(Products)
      .set({
        is_deleted: true,
        updated_at: getCurrentTimestamp(),
      })
      .where('id = :id', { id: product_id })
      .execute();

    return true;
  }
}
