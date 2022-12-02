import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG } from './config';
import { EarlyHintsMiddleware } from './early-hints.middleware';
import { HttpMiddleware } from './http.middleware';
import { BudgetsModule } from './budgets/budgets.module';
import { BudgetsController } from './budgets/budgets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Budgets } from './models/Budgets';
import { BudgetsService } from './budgets/budgets.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const configs = require('../db/config/config.json');

const env = CONFIG.IS_DEV ? 'development' : 'production';


@Module({
  imports: [
    SequelizeModule.forRoot(configs[env]),
    HttpMiddleware,
    EarlyHintsMiddleware,
    SequelizeModule.forFeature([Budgets]),
    BudgetsModule,
  ],
  controllers: [BudgetsController, AppController],
  providers: [BudgetsService, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (!CONFIG.IS_DEV) {
      consumer.apply(HttpMiddleware).exclude('/api/*').forRoutes('*');
    }
    consumer.apply(EarlyHintsMiddleware).exclude('/api/*').forRoutes('*');
  }
}
