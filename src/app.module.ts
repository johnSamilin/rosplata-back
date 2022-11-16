import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EarlyHintsMiddleware } from './early-hints.middleware';
import { HttpMiddleware } from './http.middleware';

@Module({
  imports: [HttpMiddleware, EarlyHintsMiddleware],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMiddleware).exclude('/api/*').forRoutes('*');
    consumer.apply(EarlyHintsMiddleware).exclude('/api/*').forRoutes('*');
  }
}
