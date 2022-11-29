import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG } from './config';
import { EarlyHintsMiddleware } from './early-hints.middleware';
import { HttpMiddleware } from './http.middleware';
import { BudgetsModule } from './budgets/budgets.module';
import { BudgetsController } from './budgets/budgets.controller';

@Module({
  imports: [HttpMiddleware, EarlyHintsMiddleware, BudgetsModule],
  controllers: [BudgetsController, AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (!CONFIG.IS_DEV) {
      consumer.apply(HttpMiddleware).exclude('/api/*').forRoutes('*');
    }
    consumer.apply(EarlyHintsMiddleware).exclude('/api/*').forRoutes('*');
  }
}
