import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG } from './config';
import { EarlyHintsMiddleware } from './early-hints.middleware';
import { HttpMiddleware } from './http.middleware';
import { BudgetsModule } from './api/budgets/budgets.module';
import { BudgetsController } from './api/budgets/budgets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Budgets } from './api/models/Budgets';
import { BudgetsService } from './api/budgets/budgets.service';
import { FirebaseAuthStrategy } from './api/users/firebase.strategy';
import { UsersController } from './api/users/users.controller';
import { UsersModule } from './api/users/users.module';
import { Users } from './api/models/Users';
import { UsersService } from './api/users/users.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const configs = require('../db/config/config.json');

const env = CONFIG.IS_DEV ? 'development' : 'production';

@Module({
  imports: [
    SequelizeModule.forRoot(configs[env]),
    HttpMiddleware,
    EarlyHintsMiddleware,
    SequelizeModule.forFeature([Budgets, Users]),
    BudgetsModule,
    UsersModule,
  ],
  controllers: [BudgetsController, UsersController, AppController],
  providers: [BudgetsService, UsersService, AppService, FirebaseAuthStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (!CONFIG.IS_DEV) {
      consumer.apply(HttpMiddleware).exclude('/api/*').forRoutes('*');
    }
    consumer.apply(EarlyHintsMiddleware).exclude('/api/*').forRoutes('*');
  }
}
