import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { StatisticsModule } from './statistics/statistics.module';
import { UsersModule } from './users/users.module';
import { MailingModule } from './mailing/mailing.module';
import { SettingsModule } from './settings/settings.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    UploadsModule,
    CategoriesModule,
    ProductsModule,
    StatisticsModule,
    UsersModule,
    MailingModule,
    SettingsModule,
    FeedbacksModule,
    PromocodesModule,
    OrdersModule,
  ],
})
export class AdminModule {}
