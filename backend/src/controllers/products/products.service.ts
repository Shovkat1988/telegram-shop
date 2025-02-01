import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import { ProductsData, ProductsPurchaseData } from './dto/products-data.dto';
import errorGenerator from 'src/utils/errorGenerator.utils';
import Errors from 'src/errors.enum';
import { UserDataDto } from 'src/dto/user-data.dto';
import { ProductsBody } from './dto/products-body.dto';
import { Payments } from 'src/entities/payments.entity';
import getCurrentTimestamp from 'src/utils/getCurrentTimestamp.utils';
import { ProductsOptions } from 'src/entities/products-options.entity';
import { getConfig } from 'src/utils/config.utils';
import { Orders } from 'src/entities/orders.entity';
import { Promocodes } from 'src/entities/promocodes.entity';
import { PromocodesActivations } from 'src/entities/promocodes-activations.entity';
import {
  GetProductsByCategoriesQueryDto,
  ProductsQueryDto,
} from './dto/products-query.dto';
import { Users } from 'src/entities/users.entity';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,

    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,

    @InjectRepository(ProductsOptions)
    private readonly productsOptionsRepository: Repository<ProductsOptions>,

    @InjectRepository(Payments)
    private readonly paymentsRepository: Repository<Payments>,

    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,

    @InjectRepository(PromocodesActivations)
    private readonly promocodesActivationsRepository: Repository<PromocodesActivations>,

    @InjectRepository(Promocodes)
    private readonly promocodesRepository: Repository<Promocodes>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getProductsByCategory(
    query: GetProductsByCategoriesQueryDto,
  ): Promise<ProductsData[]> {
    const ids = query.ids.split(',').map((id) => {
      const parsed = parseInt(id);

      if (isNaN(parsed)) errorGenerator(Errors.BAD_REQUEST);

      return parsed;
    });

    const findCategory = await this.categoriesRepository
      .createQueryBuilder('categories')
      .select(['categories.id as id'])
      .where('categories.id IN (:...ids)', { ids })
      .andWhere('categories.is_deleted = :is_deleted', { is_deleted: false })
      .getRawMany();

    if (!findCategory.length || findCategory.length !== ids.length)
      errorGenerator(Errors.BAD_REQUEST);

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
      .andWhere('products.category_id IN (:...ids)', { ids })
      .innerJoin('products.image_id', 'uploads')
      .orderBy('products.position', 'ASC')
      .offset(query?.offset || 0)
      .limit(query?.limit || 1000)
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

  async getProducts(query: ProductsQueryDto): Promise<ProductsData[]> {
    const ids = query?.ids?.split(',').map((id) => {
      const parsed = parseInt(id);

      if (isNaN(parsed)) errorGenerator(Errors.BAD_REQUEST);

      return parsed;
    });

    if (!ids) errorGenerator(Errors.BAD_REQUEST);

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
      .andWhere('products.id IN (:...ids)', { ids })
      .orderBy('products.position', 'ASC')
      .innerJoin('products.image_id', 'uploads')
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

  async getPurchaseData(
    user: UserDataDto,
    purchase_id: number,
  ): Promise<boolean> {
    const findPurchase = await this.paymentsRepository
      .createQueryBuilder('payments')
      .select(['payments.id as id', 'payments.completed as completed'])
      .where('payments.id = :id', { id: purchase_id })
      .andWhere('payments.created_by = :created_by', { created_by: user.id })
      .getRawOne();

    if (!findPurchase) errorGenerator(Errors.NOT_FOUND);

    return findPurchase.completed;
  }

  async purchaseProducts(
    user: UserDataDto,
    body: ProductsBody,
  ): Promise<ProductsPurchaseData> {
    const productsIds = body.items.map((product) => product.id);

    const products = await this.productsRepository
      .createQueryBuilder('products')
      .select([
        'products.id as id',
        'products.sell_price as sell_price',
        'products.title as title',
        'uploads.url as image_url',
      ])
      .where('products.id IN (:...productsIds)', { productsIds })
      .andWhere('products.is_deleted = :is_deleted', { is_deleted: false })
      .innerJoin('products.image_id', 'uploads')
      .getRawMany();

    const productOptions = await this.productsOptionsRepository
      .createQueryBuilder('products_options')
      .select([
        'products_options.id as id',
        'products_options.title as title',
        'products_options.product_id as product_id',
        'products_options.sell_price as sell_price',
      ])
      .where('products_options.product_id IN (:...productsIds)', {
        productsIds,
      })
      .getRawMany();

    let amount = body.items.reduce((acc, product) => {
      const findProduct = products.find(
        (findProduct) => findProduct.id === product.id,
      );

      if (!findProduct) errorGenerator(Errors.BAD_REQUEST);

      let additionalCost = 0;

      if (product?.options?.length)
        product.options.map((option) => {
          const findOption = productOptions.find(
            (findOption) =>
              findOption.id === option && findOption.product_id === product.id,
          );

          if (!findOption) errorGenerator(Errors.BAD_REQUEST);

          additionalCost += findOption.sell_price;
        });

      return acc + findProduct.sell_price * product.quantity + additionalCost;
    }, 0);

    const config = getConfig();

    if (amount < config.min_order_price)
      errorGenerator(Errors.MIN_ORDER_PRICE_NOT_REACHED);

    amount += config.delivery_price;

    const previousAmount = amount;

    let isPromoActivated = false;

    let findPromocode;

    if (body?.promocode) {
      findPromocode = await this.promocodesRepository
        .createQueryBuilder('promocodes')
        .select([
          'promocodes.id as id',
          'promocodes.discount as discount',
          'promocodes.activations_left as activations_left',
        ])
        .where('code = :code', { code: body.promocode })
        .andWhere('activations_left > 0')
        .getRawOne();

      if (!findPromocode) errorGenerator(Errors.PROMOCODE_NOT_FOUND);

      const findActivation = await this.promocodesActivationsRepository
        .createQueryBuilder('promocodes_activations')
        .select(['promocodes_activations.id as id'])
        .where('promocode_id = :promocode_id', {
          promocode_id: findPromocode.id,
        })
        .andWhere('promocodes_activations.activated_by = :user_id', {
          user_id: user.id,
        })
        .getRawOne();

      if (findActivation) errorGenerator(Errors.ALREADY_ACTIVATED);

      amount -= (amount * findPromocode.discount) / 100;

      if (amount === 0) amount = 1;

      isPromoActivated = true;
    }

    const findOrder = await this.ordersRepository
      .createQueryBuilder('orders')
      .select(['orders.id as id'])
      .where('orders.created_by = :created_by', { created_by: user.id })
      .andWhere('orders.full_name = :full_name', { full_name: body.full_name })
      .andWhere('orders.address = :address', { address: body.address })
      .andWhere('orders.phone = :phone', { phone: body.phone })
      .andWhere('orders.amount = :amount', { amount })
      .andWhere('orders.status = :status', { status: 0 })
      .getRawOne();

    if (findOrder) errorGenerator(Errors.ALREADY_EXISTS);

    if (isPromoActivated) {
      if (findPromocode.activations_left > 1) {
        await this.promocodesRepository
          .createQueryBuilder()
          .update(Promocodes)
          .set({
            activations_left: findPromocode.activations_left - 1,
          })
          .where('id = :id', { id: findPromocode.id })
          .execute();
      } else {
        await this.promocodesRepository
          .createQueryBuilder()
          .delete()
          .from(Promocodes)
          .where('id = :id', { id: findPromocode.id })
          .execute();
      }

      await this.promocodesActivationsRepository
        .createQueryBuilder()
        .insert()
        .into(PromocodesActivations)
        .values({
          promocode_id: findPromocode.id,
          activated_by: user.id,
          activated_at: getCurrentTimestamp(),
        })
        .execute();
    }

    const orderItems = body.items.map((product) => {
      const findProduct = products.find(
        (findProduct) => findProduct.id === product.id,
      );

      if (!findProduct) errorGenerator(Errors.BAD_REQUEST);

      let options = [];

      if (product?.options?.length)
        options = product.options.map((option) => {
          const findOption = productOptions.find(
            (findOption) =>
              findOption.id === option && findOption.product_id === product.id,
          );

          if (!findOption) errorGenerator(Errors.BAD_REQUEST);

          return {
            id: findOption.id,
            title: findOption.title,
            sell_price: findOption.sell_price,
          };
        });

      return {
        ...findProduct,
        options,
        quantity: product.quantity,
      };
    });

    const timestamp = getCurrentTimestamp();

    const insertAction = await this.ordersRepository
      .createQueryBuilder()
      .insert()
      .into(Orders)
      .values({
        items: JSON.stringify(orderItems),
        full_name: body.full_name,
        address: body.address,
        comment: body.comment || null,
        phone: body.phone,
        previous_amount: previousAmount,
        payment_type: body.payment_type,
        change_from: body.change_from || 0,
        amount,
        created_by: user.id,
        created_at: timestamp,
      })
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .update(Users)
      .set({
        phone: body.phone,
      })
      .where('id = :id', { id: user.id })
      .execute();

    const bot = new TelegramBot(process.env.BOT_TOKEN);

    await bot.sendMessage(
      user.user_id,
      `Ваш заказ №${insertAction.identifiers[0].id} на сумму <b>${amount}</b> ₽ успешно оформлен!\n\nМы будем присылать вам уведомления о статусе заказа.`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Перейти к заказу',
                web_app: {
                  url: process.env.MINI_APP_STATIC_URL,
                },
              },
            ],
          ],
        },
      },
    );

    await bot.sendMessage(
      process.env.ADMIN_GROUPS_CHAT,
      `🆕 Создан новый заказ №${
        insertAction.identifiers[0].id
      } на сумму <b>${amount} ₽</b>${
        body.promocode
          ? ` <s>${previousAmount} ₽</s> (с промокодом <b>${body.promocode}</b>)`
          : ''
      }\n
<b>🛒 Состав заказа:</b>
${orderItems
  .map((item, key) => {
    let options = '';

    if (item.options?.length)
      options = item.options
        .map((option) => option.title.toLowerCase())
        .join(', ');

    return `${key + 1}. ${item.title} - ${item.quantity} шт. ${
      options ? `(${options})` : ''
    }\n`;
  })
  .join('')}
<b>🆔 Имя клиента:</b> ${body.full_name} ${
        user?.username ? `@${user.username} ` : ''
      }<i>(${user.user_id})</i>
<b>📍 Адрес доставки:</b> ${body.address}
<b>📞 Телефон:</b> ${body.phone}
<b>💬 Комментарий:</b> ${body.comment || 'отсутствует'}
<b>💳 Способ оплаты:</b> ${
        body.payment_type === 0 ? 'наличные' : 'перевод на карту'
      }
${
  body.payment_type === 0 ? `<b>💸 Сдача с:</b> ${body.change_from || 0} ₽` : ''
}`,
      {
        parse_mode: 'HTML',
      },
    );

    return {
      amount,
      timestamp,
      id: insertAction.identifiers[0].id,
    };
  }
}
