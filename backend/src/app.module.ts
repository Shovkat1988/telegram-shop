import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResInterceptor } from './interceptors/res.interceptor';
import { ParamsMiddleware } from './middleware/params/params.middleware';
import { StartParamsModule } from './middleware/params/params.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InitializeModule } from './controllers/initialize/initialize.module';
import { AdminModule } from './controllers/admin/admin.module';
import { CategoriesModule } from './controllers/categories/categories.module';
import { ProductsModule } from './controllers/products/products.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BotModule } from './bot/bot.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { FeedbackModule } from './controllers/feedback/feedback.module';
import { OrdersModule } from './controllers/orders/orders.module';
import { PromocodesModule } from './controllers/promocodes/promocodes.module';
import { AdminMiddleware } from './middleware/admin/admin.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 25,
      },
    ]),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      extra: {
        connectionLimit: +process.env.DB_CONNECTION_LIMIT,
      },
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      charset: 'utf8mb4_general_ci',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
      synchronize: true,
      cache: false,
    }),
    StartParamsModule,
    InitializeModule,
    AdminModule,
    CategoriesModule,
    ProductsModule,
    TasksModule,
    BotModule,
    FeedbackModule,
    OrdersModule,
    PromocodesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParamsMiddleware).exclude('static/(.*)?').forRoutes('*');

    consumer
      .apply(AdminMiddleware)
      .exclude('static/(.*)?')
      .forRoutes('admin/*');
  }
}
