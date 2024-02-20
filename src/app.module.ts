import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './ROOT/api/api.module';
import { DebugModule } from './ROOT/debug/debug.module';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { PrivilegeService } from './privilege/privilege.service';


@Module({
  imports: [ApiModule, DebugModule],
  controllers: [AppController],
  providers: [AppService, PrivilegeService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '/api/*', // test secure controller needed
      method: RequestMethod.ALL,
    });
  }
}
